import { html, render } from 'https://esm.sh/htm/preact/standalone';
import { Note } from './components.js';

window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.type) {
        case "renderNote": {
            const note = message.note;
            vscode.setState({note});
            renderNote(note);
            break;
        }
    }
});

const vscode = acquireVsCodeApi();

const lastState = vscode.getState();
if (!lastState) {
    vscode.postMessage({
        type: "ready",
    });
} else {
    renderNote(lastState.note);
}

function renderNote (note) {
    function onChangeNote (note) {
        vscode.postMessage({
            type: "updateNote",
            note,
        });
    }
    render(html`<${Note} note=${note} onChangeNote=${onChangeNote} />`, document.body);
}