import { useRef, useLayoutEffect } from "react";
import { highlightElement } from "../prism_util";

type CodeBlockProps = {
  lines: string[];
  linesBefore: string[];
  linesAfter: string[];
  language: string;
  startLineNumber: number;
  endLineNumber: number;
};

export function CodeBlock(props: CodeBlockProps) {
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
    highlightElement(codeElement);
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
