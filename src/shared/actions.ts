export type Action =
  | {
      type: "READY";
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
