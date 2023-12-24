import { useState, ChangeEvent } from "react";
import { extension, groupBy } from "./utils";
import * as types from "../shared/store";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { Action } from "../shared/actions";
import { CodeBlock } from "./components/CodeBlock";
import { SnippetComment } from "./components/SnippetComment";

type NoteProps = {
  note: types.Note;
  onAction: (action: Action) => void;
};

export function Note(props: NoteProps) {
  const { note, onAction } = props;

  const snippetsByFile = groupBy(note.snippets, (snippet) => snippet.filePath);

  function handleDeleteSnippet(snippetId: string) {
    onAction({
      type: "DELETE_SNIPPET",
      snippetId,
    });
  }

  function handleChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    onAction({
      type: "CHANGE_NOTE_TITLE",
      noteId: note.noteId,
      title: event.currentTarget.value,
    });
  }

  function handleChangeComment(snippetId: string, comment: types.Comment) {
    onAction({
      type: "CHANGE_SNIPPET_COMMENT",
      snippetId,
      comment,
    });
  }

  return (
    <>
      <VSCodeTextField
        value={note.title || "Untitled"}
        onChange={handleChangeTitle as any}
      >
        Title
      </VSCodeTextField>
      {snippetsByFile.map(([filePath, snippets]) => (
        <File
          filePath={filePath}
          snippets={snippets}
          onDeleteSnippet={handleDeleteSnippet}
          onChangeComment={handleChangeComment}
          key={
            filePath +
            ":" +
            snippets.map((snippet) => snippet.snippetId).join(",")
          }
        />
      ))}
    </>
  );
}

type FileProps = {
  filePath: string;
  snippets: types.Snippet[];
  onDeleteSnippet: (snippetId: string) => void;
  onChangeComment: (snippetId: string, comment: types.Comment) => void;
};

function File(props: FileProps) {
  const { filePath, snippets, onDeleteSnippet, onChangeComment } = props;
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
          onChangeComment={onChangeComment}
          key={symbolName}
        />
      ))}
    </>
  );
}

type SymbolProps = {
  symbolName: string;
  kind: string;
  snippets: types.Snippet[];
  onDeleteSnippet: (snippetId: string) => void;
  onChangeComment: (snippetId: string, comment: types.Comment) => void;
};

function Symbol(props: SymbolProps) {
  const { symbolName, kind, snippets, onDeleteSnippet, onChangeComment } =
    props;
  return (
    <>
      <h3>
        <i className={`codicon codicon-symbol-${kind.toLowerCase()}`}></i>
        {symbolName}
      </h3>
      {snippets.map((snippet) => (
        <Snippet
          snippet={snippet}
          onDeleteSnippet={onDeleteSnippet}
          onChangeComment={onChangeComment}
          key={snippet.snippetId}
        />
      ))}
    </>
  );
}

type SnippetProps = {
  snippet: types.Snippet;
  onDeleteSnippet: (snippetId: string) => void;
  onChangeComment: (snippetId: string, comment: types.Comment) => void;
};

function Snippet(props: SnippetProps) {
  const { snippet, onDeleteSnippet, onChangeComment } = props;
  const [visible, setVisible] = useState(false);
  function handleMouseEnter() {
    setVisible(true);
  }
  function handleMouseLeave() {
    setVisible(false);
  }
  function handleChangeComment(snippetId: string, commentText: string) {
    const newComment: types.Comment =
      snippet.comments.length > 0
        ? {
            ...snippet.comments[0],
            text: commentText,
          }
        : {
            commentId: "",
            startLineNumber: snippet.startLineNumber,
            endLineNumber: snippet.endLineNumber,
            text: commentText,
          };
    onChangeComment(snippetId, newComment);
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
      <SnippetComment
        snippetId={snippet.snippetId}
        comment={snippet.comments.at(0)}
        onChangeComment={handleChangeComment}
      />
    </div>
  );
}

type SnippetActionsProps = {
  visible: boolean;
  snippetId: string;
  onDeleteSnippet: (snippetId: string) => void;
};

function SnippetActions(props: SnippetActionsProps) {
  const { visible, snippetId, onDeleteSnippet } = props;
  return (
    <div className="snippet-actions" hidden={!visible}>
      <button type="button" onClick={() => onDeleteSnippet(snippetId)}>
        <i className="codicon codicon-trash"></i>
      </button>
    </div>
  );
}
