import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Note } from "./components";
import type * as types from "../shared/store";
import { Action } from "../shared/actions";

type State = {
  note: types.Note;
};

window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.type) {
    case "renderNote": {
      const note = message.note;
      vscode.setState({ note });
      renderNote(note);
      break;
    }
  }
});

const root = createRoot(document.getElementById("root")!);

const vscode = acquireVsCodeApi<State>();

const lastState = vscode.getState();
if (!lastState) {
  vscode.postMessage({
    type: "ready",
  });
} else {
  renderNote(lastState.note);
}

function renderNote(note: types.Note) {
  function handleAction(action: Action) {
    console.log(action);
    vscode.postMessage(action);
  }

  console.log(note);
  root.render(createElement(Note, { note, onAction: handleAction }));
}
