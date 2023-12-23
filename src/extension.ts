// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path from "path";
import * as vscode from "vscode";
import { Note, Snippet } from "./store";
import * as os from "os";
import { NoteViewProvider } from "./view";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "code-reader" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "code-reader.addLines",
    async () => {
      console.log("addLines");
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const selection = editor.selection;

      const startLine = selection.start.line;
      const endLine = selection.end.line;

      let selectedLines = getLines(editor, startLine, endLine);
      const selectedText = selectedLines.join("\n");

      const fullPath = editor.document.uri.fsPath;
      const relativePath = path.relative(os.homedir(), fullPath);

      //   const workspaceRoot =
      //     vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || "";
      //   const workspaceParent = path.dirname(workspaceRoot);

      //   // 相対パスを計算
      //   const relativePath = path.relative(workspaceParent, fullPath);

      console.log(relativePath);
      console.log("--- selectedText ---");
      console.log(selectedText);
      console.log("--------------------");

      const snippet: Snippet = {
        snippetId: randomId(),
        filePath: relativePath,
        startLineNumber: startLine,
        endLineNumber: endLine,
        lines: selectedLines,
        linesBefore: getLines(editor, startLine - 1000, startLine - 1),
        linesAfter: getLines(editor, endLine + 1, endLine + 1000),
        contextSymbols: (
          await findSymbolsAt(editor.document, selection.active)
        ).map((symbol) => ({
          name: symbol.name,
          containerName: symbol.containerName,
          kind: symbol.kind,
          startLineNumber: symbol.location.range.start.line,
          endLineNumber: symbol.location.range.end.line,
        })),
        comments: [],
      };
      activeNote.snippets.push(snippet);
      saveNote(context, activeNote);

      noteViewProvider.renderNote(activeNote);

      await resolveDefinitions(editor);
    }
  );

  const noteViewProvider = new NoteViewProvider(context.extensionUri, () => {
    noteViewProvider.renderNote(activeNote);
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("noteView", noteViewProvider)
  );

  const activeNote = loadNote(context);
  console.log("--- activeNote ---");
  console.log(JSON.stringify(activeNote, null, 2));
  console.log("------------------");
}

function getLines(
  editor: vscode.TextEditor,
  startLine: number,
  endLine: number
) {
  if (endLine < startLine) {
    throw new Error("endLine must be greater than or equal to startLine");
  }
  if (endLine < 0 || startLine >= editor.document.lineCount) {
    return [];
  }
  startLine = Math.max(startLine, 0);
  endLine = Math.min(endLine, editor.document.lineCount - 1);

  const selectedLines = [];
  for (let i = startLine; i <= endLine; i++) {
    const lineText = editor.document.lineAt(i).text;
    selectedLines.push(lineText);
  }
  return selectedLines;
}

async function findSymbolsAt(
  document: vscode.TextDocument,
  position: vscode.Position
): Promise<vscode.SymbolInformation[]> {
  const symbols = await vscode.commands.executeCommand<
    vscode.SymbolInformation[] | undefined
  >("vscode.executeDocumentSymbolProvider", document.uri);
  console.log("symbols", symbols);
  if (symbols) {
    // カーソル位置に最も近い関数のシンボルを探す
    for (const symbol of symbols) {
      if (
        // symbol.kind === vscode.SymbolKind.Function &&
        symbol.location.range.contains(position)
      ) {
        return [symbol];
      }
    }
  }
  return [];
}

async function resolveDefinitions(editor: vscode.TextEditor) {
  const position = editor.selection.active;
  const definitions = (await vscode.commands.executeCommand(
    "vscode.executeDefinitionProvider",
    editor.document.uri,
    position
  )) as Array<vscode.Location | vscode.LocationLink>;

  definitions.forEach((def) => {
    if ("targetUri" in def) {
      console.log("targetUri", def.targetUri.fsPath);
    } else if ("uri" in def) {
      console.log("uri", def.uri.fsPath);
    }
  });
}

function loadNote(context: vscode.ExtensionContext): Note {
  const workspaceState = context.workspaceState;
  return workspaceState.get<Note>("note", {
    noteId: randomId(),
    title: "",
    snippets: [],
  });
}

function saveNote(
  context: vscode.ExtensionContext,
  note: Note
): Thenable<void> {
  const workspaceState = context.workspaceState;
  return workspaceState.update("note", note);
}

function randomId(): string {
  return (
    new Date().getTime().toString(36) + Math.random().toString(36).slice(2)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
