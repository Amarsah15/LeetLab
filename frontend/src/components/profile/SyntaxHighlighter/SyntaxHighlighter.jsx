import React, { useState } from "react";

const SyntaxHighlighter = ({
  code,
  language,
  className = "",
  maxLines = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const highlightCode = (code, language) => {
    const keywords = {
      javascript: [
        "function",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "return",
        "new",
        "Map",
        "has",
        "get",
        "set",
        "async",
        "await",
        "try",
        "catch",
        "require",
        "module",
        "exports",
        "console",
      ],
      python: [
        "def",
        "if",
        "else",
        "elif",
        "for",
        "while",
        "return",
        "len",
        "range",
        "True",
        "False",
        "None",
        "import",
        "from",
        "as",
        "class",
        "self",
        "print",
      ],
      java: [
        "public",
        "private",
        "class",
        "int",
        "void",
        "if",
        "else",
        "while",
        "for",
        "return",
        "new",
        "null",
        "this",
        "static",
        "final",
        "System",
      ],
      cpp: [
        "#include",
        "using",
        "namespace",
        "int",
        "void",
        "if",
        "else",
        "for",
        "while",
        "return",
        "cout",
        "cin",
        "std",
      ],
      c: [
        "#include",
        "int",
        "void",
        "if",
        "else",
        "for",
        "while",
        "return",
        "printf",
        "scanf",
        "main",
      ],
    };

    const types = {
      javascript: [
        "String",
        "Number",
        "Boolean",
        "Array",
        "Object",
        "Map",
        "Set",
        "Promise",
      ],
      python: ["str", "int", "float", "list", "dict", "tuple", "set", "bool"],
      java: [
        "String",
        "int",
        "boolean",
        "double",
        "float",
        "char",
        "long",
        "short",
        "byte",
      ],
      cpp: [
        "string",
        "int",
        "bool",
        "double",
        "float",
        "char",
        "vector",
        "long",
      ],
      c: ["int", "char", "float", "double", "void", "long", "short"],
    };

    // Escape HTML first to prevent conflicts
    let highlighted = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Highlight multi-line comments first (to avoid conflicts with single-line)
    highlighted = highlighted.replace(
      /\/\*[\s\S]*?\*\//g,
      '<span class="text-gray-500 italic">$&</span>',
    );

    // Highlight single-line comments
    highlighted = highlighted.replace(
      /\/\/(.*)$/gm,
      '<span class="text-gray-500 italic">//$1</span>',
    );
    highlighted = highlighted.replace(
      /^(\s*)#(.*)$/gm,
      '<span class="text-gray-500 italic">$1#$2</span>',
    );

    // Highlight strings (avoiding already highlighted content)
    highlighted = highlighted.replace(
      /"([^"]*)"(?![^<]*<\/span>)/g,
      '<span class="text-yellow-400">"$1"</span>',
    );
    highlighted = highlighted.replace(
      /'([^']*)'(?![^<]*<\/span>)/g,
      "<span class=\"text-yellow-400\">'$1'</span>",
    );

    // Highlight keywords (avoiding already highlighted content)
    if (keywords[language]) {
      keywords[language].forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b(?![^<]*</span>)`, "g");
        highlighted = highlighted.replace(
          regex,
          `<span class="text-blue-400 font-semibold">${keyword}</span>`,
        );
      });
    }

    // Highlight types/classes (avoiding already highlighted content)
    if (types[language]) {
      types[language].forEach((type) => {
        const regex = new RegExp(`\\b${type}\\b(?![^<]*</span>)`, "g");
        highlighted = highlighted.replace(
          regex,
          `<span class="text-green-400 font-semibold">${type}</span>`,
        );
      });
    }

    // Highlight numbers (avoiding already highlighted content)
    highlighted = highlighted.replace(
      /\b(\d+)\b(?![^<]*<\/span>)/g,
      '<span class="text-purple-400">$1</span>',
    );

    return highlighted;
  };

  const displayCode =
    maxLines && !isExpanded
      ? code.split("\n").slice(0, maxLines).join("\n") +
        (code.split("\n").length > maxLines ? "\n..." : "")
      : code;

  const shouldShowExpandButton = maxLines && code.split("\n").length > maxLines;

  return (
    <div>
      <div
        className={`mockup-code bg-gray-900 text-gray-300 overflow-x-auto rounded-lg ${className}`}
      >
        <pre className="p-4">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(displayCode, language),
            }}
          />
        </pre>
      </div>

      {shouldShowExpandButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default SyntaxHighlighter;
