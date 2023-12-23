import { html, useRef, useLayoutEffect } from 'https://esm.sh/htm/preact/standalone';

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
    const snippetsBySymbolName = groupBy(snippets, (snippet) => snippet.contextSymbols[0].name);
    return html`
    <h2>${filePath}</h2>
    ${snippetsBySymbolName.map(([symbolName, snippets]) => html`<${Symbol} symbolName=${symbolName} snippets=${snippets} key=${symbolName}/>`)}
    `;
}

function Symbol(props) {
    const {symbolName, snippets} = props;
    return html`
    <h3>${symbolName}</h3>
    ${snippets.map((snippet) => html`<${Snippet} snippet=${snippet} key=${snippet.id}/>`)}
    `;
}

function Snippet(props) {
    const {snippet} = props;
    return html`<${CodeBlock} code=${snippet.lines.join("\n")} language=${extension(snippet.filePath)} startLineNumber=${snippet.startLineNumber}/>
    `;
}

function extension(filePath) {
    const match = filePath.match(/\.([^\.]+)$/);
    if (match) {
        return match[1];
    }
    return "";
}

function CodeBlock(props) {
    const {code, language, startLineNumber} = props;
    const className = `language-${language} line-numbers`;
    const codeRef = useRef(null);
    useLayoutEffect(() => {
        Prism.highlightElement(codeRef.current);
    });

    return html`
    <pre data-start=${startLineNumber + 1}><code ref=${codeRef} class=${className}>${code}</code></pre>
    `;
}

function groupBy(array, getKey) {
    const grouped = [];
    let lastKey = null;
    let lastGroup = null;
    for (const item of array) {
        const key = getKey(item);
        if (key !== lastKey) {
            lastKey = key;
            lastGroup = [];
            grouped.push([key, lastGroup]);
        }
        lastGroup.push(item);
    }
    return grouped;
}
