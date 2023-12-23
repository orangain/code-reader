import { SymbolKind } from "vscode";

export type Note = {
  noteId: string;
  title: string;
  snippets: Snippet[];
};

export type Snippet = {
  snippetId: string;
  filePath: string;
  startLineNumber: number;
  endLineNumber: number;
  lines: string[];
  linesBefore: string[];
  linesAfter: string[];
  contextSymbols: Symbol[];
  comments: Comment[];
};

export type Symbol = {
  name: string;
  containerName: string;
  kind: SymbolKind;
  startLineNumber: number;
  endLineNumber: number;
};

export type Comment = {
  commentId: string;
  startLineNumber: number;
  endLineNumber: number;
  text: string;
};
