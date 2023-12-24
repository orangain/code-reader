import { useRef, useState, useLayoutEffect } from "react";
import { extension, groupBy } from "./utils";
import * as types from "../shared/store";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

const Prism = globalThis.Prism;
Prism.manual = true;

type NoteProps = {
  note: types.Note;
  onChangeNote: (note: types.Note) => void;
};

export function Note(props: NoteProps) {
  const { note, onChangeNote } = props;

  const snippetsByFile = groupBy(note.snippets, (snippet) => snippet.filePath);

  function handleDeleteSnippet(snippetId) {
    console.log("handleDeleteSnippet", snippetId);
    const newSnippets = note.snippets.filter((s) => s.snippetId !== snippetId);
    onChangeNote({
      ...note,
      snippets: newSnippets,
    });
  }

  return (
    <>
      <VSCodeTextField value={note.title || "Untitled"} label="Title">
        Title
      </VSCodeTextField>
      {snippetsByFile.map(([filePath, snippets]) => (
        <File
          filePath={filePath}
          snippets={snippets}
          onDeleteSnippet={handleDeleteSnippet}
          key={filePath}
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

function Symbol(props) {
  const { symbolName, kind, snippets, onDeleteSnippet } = props;
  return (
    <>
      <h3>
        <i className="codicon codicon-symbol-${kind.toLowerCase()}"></i>
        {symbolName}
      </h3>
      {snippets.map((snippet) => (
        <Snippet
          snippet={snippet}
          onDeleteSnippet={onDeleteSnippet}
          key={snippet.id}
        />
      ))}
    </>
  );
}

function Snippet(props) {
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

function SnippetActions(props) {
  const { visible, snippetId, onDeleteSnippet } = props;
  return (
    <div className="snippet-actions" hidden={!visible}>
      <button type="button" onClick={() => onDeleteSnippet(snippetId)}>
        <i className="codicon codicon-trash"></i>
      </button>
    </div>
  );
}

function CodeBlock(props) {
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
    Prism.highlightElement(codeElement);
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
