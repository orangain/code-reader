import * as vscode from "vscode";
import { SymbolKind } from "./shared/store";

export function vscodeSymbolKindToString(kind: vscode.SymbolKind): SymbolKind {
  switch (kind) {
    case vscode.SymbolKind.File:
      return "File";
    case vscode.SymbolKind.Module:
      return "Module";
    case vscode.SymbolKind.Namespace:
      return "Namespace";
    case vscode.SymbolKind.Package:
      return "Package";
    case vscode.SymbolKind.Class:
      return "Class";
    case vscode.SymbolKind.Method:
      return "Method";
    case vscode.SymbolKind.Property:
      return "Property";
    case vscode.SymbolKind.Field:
      return "Field";
    case vscode.SymbolKind.Constructor:
      return "Constructor";
    case vscode.SymbolKind.Enum:
      return "Enum";
    case vscode.SymbolKind.Interface:
      return "Interface";
    case vscode.SymbolKind.Function:
      return "Function";
    case vscode.SymbolKind.Variable:
      return "Variable";
    case vscode.SymbolKind.Constant:
      return "Constant";
    case vscode.SymbolKind.String:
      return "String";
    case vscode.SymbolKind.Number:
      return "Number";
    case vscode.SymbolKind.Boolean:
      return "Boolean";
    case vscode.SymbolKind.Array:
      return "Array";
    case vscode.SymbolKind.Object:
      return "Object";
    case vscode.SymbolKind.Key:
      return "Key";
    case vscode.SymbolKind.Null:
      return "Null";
    case vscode.SymbolKind.EnumMember:
      return "EnumMember";
    case vscode.SymbolKind.Struct:
      return "Struct";
    case vscode.SymbolKind.Event:
      return "Event";
    case vscode.SymbolKind.Operator:
      return "Operator";
    case vscode.SymbolKind.TypeParameter:
      return "TypeParameter";
    default:
      throw new Error(`Unknown SymbolKind: ${kind}`);
  }
}
