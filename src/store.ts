export type SymbolKind =
  | "File"
  | "Module"
  | "Namespace"
  | "Package"
  | "Class"
  | "Method"
  | "Property"
  | "Field"
  | "Constructor"
  | "Enum"
  | "Interface"
  | "Function"
  | "Variable"
  | "Constant"
  | "String"
  | "Number"
  | "Boolean"
  | "Array"
  | "Object"
  | "Key"
  | "Null"
  | "EnumMember"
  | "Struct"
  | "Event"
  | "Operator"
  | "TypeParameter";

export type Note = {
  noteId: string;
  title: string;
  snippets: Snippet[];
};

export type Snippet = {
  snippetId: string;
  filePath: string;
  startLineNumber: number; // 0-based
  endLineNumber: number; // 0-based
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
  startLineNumber: number; // 0-based
  endLineNumber: number; // 0-based
};

export type Comment = {
  commentId: string;
  startLineNumber: number; // 0-based
  endLineNumber: number; // 0-based
  text: string;
};
