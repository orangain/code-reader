import Prism from "prismjs";
import "prismjs/plugins/autoloader/prism-autoloader.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-highlight/prism-line-highlight.js";

Prism.manual = true;
Prism.plugins.autoloader.languages_path = `${
  (globalThis as any as { nodeModulesUri: string }).nodeModulesUri
}/prismjs/components/`;

export function highlightElement(element: HTMLElement) {
  Prism.highlightElement(element);
}
