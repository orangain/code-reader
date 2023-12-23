import { html, useRef, useLayoutEffect } from 'https://esm.sh/htm/preact/standalone';
import { extension, groupBy } from './utils.js';

const Prism = window.Prism;
Prism.manual = true;

export function Note(props) {
    const {note} = props;

    const snippetsByFile = groupBy(note.snippets, (snippet) => snippet.filePath);

    return html`
    <h1>${note.title || "Untitled"}</h1>
    ${snippetsByFile.map(([filePath, snippets]) => html`<${File} filePath=${filePath} snippets=${snippets} key=${filePath}/>`)}
    `;
}

function File(props) {
    const {filePath, snippets} = props;
    const snippetsBySymbolName = groupBy(snippets, (snippet) => snippet.contextSymbols[0]?.name ?? "");
    return html`
    <h2><i class="codicon codicon-symbol-file"></i> ${filePath}</h2>
    ${snippetsBySymbolName.map(([symbolName, snippets]) => html`
        <${Symbol} symbolName=${symbolName} kind=${snippets[0].contextSymbols[0]?.kind ?? ""} snippets=${snippets} key=${symbolName}/>
    `)}
    `;
}

function Symbol(props) {
    const {symbolName, kind, snippets} = props;
    return html`
    <h3><i class="codicon codicon-symbol-${kind.toLowerCase()}"></i> ${symbolName}</h3>
    ${snippets.map((snippet) => html`<${Snippet} snippet=${snippet} key=${snippet.id}/>`)}
    `;
}

function Snippet(props) {
    const {snippet} = props;
    return html`<${CodeBlock}
        lines=${snippet.lines}
        linesBefore=${snippet.linesBefore.slice(-3)}
        linesAfter=${snippet.linesAfter.slice(0, 3)}
        language=${extension(snippet.filePath)}
        startLineNumber=${snippet.startLineNumber}
        endLineNumber=${snippet.endLineNumber}
    />
    `;
}

function CodeBlock(props) {
    const {lines, linesBefore, linesAfter, language, startLineNumber, endLineNumber} = props;
    const className = `language-${language} line-numbers`;
    const code = [...linesBefore, ...lines, ...linesAfter].join("\n");
    const contextStartLineNumber = startLineNumber - linesBefore.length; // 0-based

    const codeRef = useRef(null);
    useLayoutEffect(() => {
        Prism.highlightElement(codeRef.current);
    });

    return html`
    <pre class=${className} data-line="${startLineNumber + 1}-${endLineNumber + 1}" data-line-offset=${contextStartLineNumber} data-start=${contextStartLineNumber + 1}><code ref=${codeRef}>${code}</code></pre>
    `;
}
