import { Snippet } from "./store";

export type Action =
  | {
      type: "READY";
    }
  | {
      type: "ADD_SNIPPET";
      snippet: Snippet;
    }
  | {
      type: "DELETE_SNIPPET";
      snippetId: string;
    }
  | {
      type: "CHANGE_NOTE_TITLE";
      noteId: string;
      title: string;
    };
