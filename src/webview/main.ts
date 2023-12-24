import { render } from "preact";
import { html } from "htm/preact";
import { Note } from "./components";
import type * as types from "../store";

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
  render(
    html`<${Note} note=${note} onChangeNote=${onChangeNote} />`,
    document.body
  );
}
