import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import * as types from "../../shared/store";
import { ChangeEvent, useLayoutEffect, useRef, useState } from "react";

type SnippetCommentProps = {
  snippetId: string;
  comment: types.Comment | undefined;
  onChangeComment: (snippetId: string, commentText: string) => void;
};

export function SnippetComment(props: SnippetCommentProps) {
  const { snippetId, comment, onChangeComment } = props;
  const [editing, setEditing] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!editing || divRef.current === null) {
      return;
    }
    const textArea = divRef.current.querySelector("vscode-text-area");
    if (textArea === null) {
      return;
    }
    (textArea as any).focus();
  }, [editing]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const commentText = event.target.value;
    onChangeComment(snippetId, commentText);
  }

  if (editing) {
    return (
      <div ref={divRef}>
        <VSCodeTextArea
          value={comment?.text ?? ""}
          style={{ width: "100%" }}
          onChange={handleChange as any}
          onBlur={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div onClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
      {comment?.text ?? "Add a comment..."}
    </div>
  );
}
