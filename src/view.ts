import * as vscode from "vscode";
import { Note } from "./shared/store";
import { Action } from "./shared/actions";

export class NoteViewProvider implements vscode.WebviewViewProvider {
  private webviewView?: vscode.WebviewView;
  private extensionUri: vscode.Uri;
  private onAction: (action: Action) => Promise<void>;

  constructor(
    extensionUri: vscode.Uri,
    onAction: (action: Action) => Promise<void>
  ) {
    this.extensionUri = extensionUri;
    this.onAction = onAction;
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
      this.onAction(message);
    });

    webviewView.webview.html = this.initialWebviewContent();
  }

  initialWebviewContent() {
    const colorTheme = vscode.window.activeColorTheme;
    const prismStyleUri =
      colorTheme.kind === vscode.ColorThemeKind.Dark ||
      colorTheme.kind === vscode.ColorThemeKind.HighContrast
        ? "https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-vsc-dark-plus.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-vs.min.css";

    const scriptUri = this.webviewView!.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "out", "webview.js")
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
    const nodeModulesUri = this.webviewView!.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "node_modules")
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
    <link href="${codiconsStyleUri}" rel="stylesheet">
    <link href="${styleUri}" rel="stylesheet">
    <script>
        window.nodeModulesUri = "${nodeModulesUri}";
    </script>
    <script type="module" src="${scriptUri}"></script>
</head>
<body>
    <div id="root"></div>
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
