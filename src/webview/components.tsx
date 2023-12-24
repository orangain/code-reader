import { useRef, useState, useLayoutEffect, ChangeEvent } from "react";
import { extension, groupBy } from "./utils";
import * as types from "../shared/store";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { Action } from "../shared/actions";
import { highlightElement } from "./prism_util";

type NoteProps = {
  note: types.Note;
  onAction: (action: Action) => void;
};

export function Note(props: NoteProps) {
  const { note, onAction } = props;

  const snippetsByFile = groupBy(note.snippets, (snippet) => snippet.filePath);

  function handleDeleteSnippet(snippetId: string) {
    onAction({
      type: "DELETE_SNIPPET",
      snippetId,
    });
  }

  function handleChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    onAction({
      type: "CHANGE_NOTE_TITLE",
      noteId: note.noteId,
      title: event.currentTarget.value,
    });
  }

  return (
    <>
      <VSCodeTextField
        value={note.title || "Untitled"}
        onChange={handleChangeTitle as any}
      >
        Title
      </VSCodeTextField>
      {snippetsByFile.map(([filePath, snippets]) => (
        <File
          filePath={filePath}
          snippets={snippets}
          onDeleteSnippet={handleDeleteSnippet}
          key={
            filePath +
            ":" +
            snippets.map((snippet) => snippet.snippetId).join(",")
          }
        />
      ))}
    </>
  );
}

type FileProps = {
  filePath: string;
  snippets: types.Snippet[];
  onDeleteSnippet: (snippetId: string) => void;
};

function File(props: FileProps) {
  const { filePath, snippets, onDeleteSnippet } = props;
  const snippetsBySymbolName = groupBy(
    snippets,
    (snippet) => snippet.contextSymbols[0]?.name ?? ""
  );
  return (
    <>
      <h2>
        <i className="codicon codicon-symbol-file"></i> {filePath}
      </h2>
      {snippetsBySymbolName.map(([symbolName, snippets]) => (
        <Symbol
          symbolName={symbolName}
          kind={snippets[0].contextSymbols[0]?.kind ?? ""}
          snippets={snippets}
          onDeleteSnippet={onDeleteSnippet}
          key={symbolName}
        />
      ))}
    </>
  );
}

type SymbolProps = {
  symbolName: string;
  kind: string;
  snippets: types.Snippet[];
  onDeleteSnippet: (snippetId: string) => void;
};

function Symbol(props: SymbolProps) {
  const { symbolName, kind, snippets, onDeleteSnippet } = props;
  return (
    <>
      <h3>
        <i className={`codicon codicon-symbol-${kind.toLowerCase()}`}></i>
        {symbolName}
      </h3>
      {snippets.map((snippet) => (
        <Snippet
          snippet={snippet}
          onDeleteSnippet={onDeleteSnippet}
          key={snippet.snippetId}
        />
      ))}
    </>
  );
}

type SnippetProps = {
  snippet: types.Snippet;
  onDeleteSnippet: (snippetId: string) => void;
};

function Snippet(props: SnippetProps) {
  const { snippet, onDeleteSnippet } = props;
  const [visible, setVisible] = useState(false);
  function handleMouseEnter() {
    setVisible(true);
  }
  function handleMouseLeave() {
    setVisible(false);
  }

  return (
    <div
      className="snippet"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SnippetActions
        visible={visible}
        snippetId={snippet.snippetId}
        onDeleteSnippet={onDeleteSnippet}
      />
      <CodeBlock
        key={snippet.snippetId}
        lines={snippet.lines}
        linesBefore={snippet.linesBefore.slice(-3)}
        linesAfter={snippet.linesAfter.slice(0, 3)}
        language={extension(snippet.filePath)}
        startLineNumber={snippet.startLineNumber}
        endLineNumber={snippet.endLineNumber}
      />
    </div>
  );
}

type SnippetActionsProps = {
  visible: boolean;
  snippetId: string;
  onDeleteSnippet: (snippetId: string) => void;
};

function SnippetActions(props: SnippetActionsProps) {
  const { visible, snippetId, onDeleteSnippet } = props;
  return (
    <div className="snippet-actions" hidden={!visible}>
      <button type="button" onClick={() => onDeleteSnippet(snippetId)}>
        <i className="codicon codicon-trash"></i>
      </button>
    </div>
  );
}

type CodeBlockProps = {
  lines: string[];
  linesBefore: string[];
  linesAfter: string[];
  language: string;
  startLineNumber: number;
  endLineNumber: number;
};

function CodeBlock(props: CodeBlockProps) {
  const {
    lines,
    linesBefore,
    linesAfter,
    language,
    startLineNumber,
    endLineNumber,
  } = props;
  const className = `language-${language} line-numbers`;
  const code = [...linesBefore, ...lines, ...linesAfter].join("\n");
  const contextStartLineNumber = startLineNumber - linesBefore.length; // 0-based

  // See: https://github.com/preactjs/preact/issues/3236
  const preRef = useRef<HTMLPreElement>(null);
  useLayoutEffect(() => {
    if (!preRef.current) {
      throw new Error("preRef.current is null");
    }

    const codeElement = preRef.current.getElementsByTagName("code")[0];
    codeElement.textContent = code;
    highlightElement(codeElement);
  });

  return (
    <pre
      ref={preRef}
      className={className}
      data-line={`${startLineNumber + 1}-${endLineNumber + 1}`}
      data-line-offset={contextStartLineNumber}
      data-start={contextStartLineNumber + 1}
    >
      <code>{code}</code>
    </pre>
  );
}
