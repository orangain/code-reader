import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import * as types from "../../shared/store";
import { ChangeEvent } from "react";

type SnippetCommentProps = {
  snippetId: string;
  comment: types.Comment | undefined;
  onChangeComment: (snippetId: string, commentText: string) => void;
};

export function SnippetComment(props: SnippetCommentProps) {
  const { snippetId, comment, onChangeComment } = props;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const commentText = event.target.value;
    onChangeComment(snippetId, commentText);
  }

  return (
    <VSCodeTextArea
      value={comment?.text ?? ""}
      onChange={handleChange as any}
    ></VSCodeTextArea>
  );
}
