import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Note } from "./components";
import type * as types from "../shared/store";

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

const vscode = acquireVsCodeApi<State>();

const lastState = vscode.getState();
if (!lastState) {
  vscode.postMessage({
    type: "ready",
  });
} else {
  renderNote(lastState.note);
}

function renderNote(note) {
  function onChangeNote(note) {
    vscode.postMessage({
      type: "updateNote",
      note,
    });
  }

  const root = createRoot(document.body);
  root.render(createElement(Note, { note, onChangeNote }));
}
