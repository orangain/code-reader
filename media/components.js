import { html, useRef, useLayoutEffect } from 'https://esm.sh/htm/preact/standalone';
import { extension, groupBy } from './utils.js';

const Prism = globalThis.Prism;
Prism.manual = true;

export function Note(props) {
    const {note, onChangeNote} = props;

    const snippetsByFile = groupBy(note.snippets, (snippet) => snippet.filePath);

    function handleDeleteSnippet(snippetId) {
        console.log("handleDeleteSnippet", snippetId);
        const newSnippets = note.snippets.filter((s) => s.snippetId !== snippetId);
        onChangeNote({
            ...note,
            snippets: newSnippets,
        });
    }
    
    return html`
    <h1>${note.title || "Untitled"}</h1>
    ${snippetsByFile.map(([filePath, snippets]) => html`<${File}
        filePath=${filePath}
        snippets=${snippets}
        onDeleteSnippet=${handleDeleteSnippet}
        key=${filePath}
    />`)}
    `;
}

function File(props) {
    const {filePath, snippets, onDeleteSnippet} = props;
    const snippetsBySymbolName = groupBy(snippets, (snippet) => snippet.contextSymbols[0]?.name ?? "");
    return html`
    <h2><i class="codicon codicon-symbol-file"></i> ${filePath}</h2>
    ${snippetsBySymbolName.map(([symbolName, snippets]) => html`
        <${Symbol}
            symbolName=${symbolName}
            kind=${snippets[0].contextSymbols[0]?.kind ?? ""}
            snippets=${snippets}
            onDeleteSnippet=${onDeleteSnippet}
            key=${symbolName}
        />
    `)}
    `;
}

function Symbol(props) {
    const {symbolName, kind, snippets, onDeleteSnippet} = props;
    return html`
    <h3><i class="codicon codicon-symbol-${kind.toLowerCase()}"></i> ${symbolName}</h3>
    ${snippets.map((snippet) => html`<${Snippet}
        snippet=${snippet}
        onDeleteSnippet=${onDeleteSnippet}
        key=${snippet.id}
    />`)}
    `;
}

function Snippet(props) {
    const {snippet, onDeleteSnippet} = props;
    return html`<div>
        <${SnippetActions} snippetId=${snippet.snippetId} onDeleteSnippet=${onDeleteSnippet} />
        <${CodeBlock}
            key=${snippet.snippetId}
            lines=${snippet.lines}
            linesBefore=${snippet.linesBefore.slice(-3)}
            linesAfter=${snippet.linesAfter.slice(0, 3)}
            language=${extension(snippet.filePath)}
            startLineNumber=${snippet.startLineNumber}
            endLineNumber=${snippet.endLineNumber}
        />
    </div>`;
}

function SnippetActions(props) {
    const {visible, snippetId, onDeleteSnippet} = props;
    return html`<div class="snippet-actions">
        <button type="button" onClick=${() => onDeleteSnippet(snippetId)}><i class="codicon codicon-trash"></i></button>
    </div>`;
}

function CodeBlock(props) {
    const {lines, linesBefore, linesAfter, language, startLineNumber, endLineNumber} = props;
    const className = `language-${language} line-numbers`;
    const code = [...linesBefore, ...lines, ...linesAfter].join("\n");
    const contextStartLineNumber = startLineNumber - linesBefore.length; // 0-based

    // See: https://github.com/preactjs/preact/issues/3236
    const preRef = useRef(null);
    useLayoutEffect(() => {
        const codeElement = preRef.current.getElementsByTagName("code")[0];
        codeElement.textContent = code;
        Prism.highlightElement(codeElement);
    });

    return html`<pre
        ref=${preRef}
        class=${className}
        data-line="${startLineNumber + 1}-${endLineNumber + 1}"
        data-line-offset=${contextStartLineNumber}
        data-start=${contextStartLineNumber + 1}>
            <code dangerouslySetInnerHTML=${{}}>${code}</code>
        </pre>`;
}
