import * as vscode from "vscode";
import { Note } from "./store";

export class NoteViewProvider implements vscode.WebviewViewProvider {
  private webviewView?: vscode.WebviewView;
  private extensionUri: vscode.Uri;
  private onReady: () => void;
  private onUpdateNote: (note: Note) => void;

  constructor(
    extensionUri: vscode.Uri,
    onReady: () => void,
    onUpdateNote: (note: Note) => void
  ) {
    this.extensionUri = extensionUri;
    this.onReady = onReady;
    this.onUpdateNote = onUpdateNote;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ): Thenable<void> | void {
    this.webviewView = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.onDidReceiveMessage((message) => {
      this.onMessage(message);
    });

    webviewView.webview.html = this.initialWebviewContent();
  }

  onMessage(message: any) {
    switch (message.type) {
      case "ready":
        this.onReady();
        break;
      case "updateNote":
        this.onUpdateNote(message.note);
        break;
    }
  }

  initialWebviewContent() {
    const colorTheme = vscode.window.activeColorTheme;
    const prismStyleUri =
      colorTheme.kind === vscode.ColorThemeKind.Dark ||
      colorTheme.kind === vscode.ColorThemeKind.HighContrast
        ? "https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-vsc-dark-plus.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-vs.min.css";

    const scriptUri = this.webviewView!.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "main.js")
    );
    const styleUri = this.webviewView!.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "main.css")
    );
    const codiconsStyleUri = this.webviewView!.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css"
      )
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Reader Note</title>

    <link href="${prismStyleUri}" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-highlight/prism-line-highlight.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-highlight/prism-line-highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <link href="${codiconsStyleUri}" rel="stylesheet">
    <link href="${styleUri}" rel="stylesheet">
    <script type="module" src="${scriptUri}"></script>
</head>
<body>
</body>
</html>`;
  }

  renderNote(note: Note) {
    if (this.webviewView === undefined) {
      throw new Error("webviewView is undefined");
    }

    this.webviewView.webview.postMessage({
      type: "renderNote",
      note: note,
    });
  }
}
