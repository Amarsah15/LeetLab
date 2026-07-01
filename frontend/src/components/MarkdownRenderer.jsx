import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && (match || String(children).includes("\n"))) {
              return (
                <pre className="bg-neutral text-neutral-content rounded-xl p-4 overflow-x-auto my-4">
                  <code
                    className={`text-sm font-mono ${className || ""}`}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code
                className="bg-base-300 text-primary px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Tables
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="table table-zebra w-full">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-base-300">{children}</thead>;
          },
          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-base-content/80">
                {children}
              </blockquote>
            );
          },
          // Lists
          ul({ children }) {
            return (
              <ul className="list-disc pl-6 my-2 space-y-1">{children}</ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal pl-6 my-2 space-y-1">{children}</ol>
            );
          },
          // Headings
          h1({ children }) {
            return <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
          },
          // Paragraphs
          p({ children }) {
            return <p className="my-2 leading-relaxed">{children}</p>;
          },
          // Strong/Bold
          strong({ children }) {
            return (
              <strong className="font-bold text-base-content">
                {children}
              </strong>
            );
          },
          // Links
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-primary hover:text-primary-focus underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          // Horizontal rule
          hr() {
            return <hr className="my-6 border-base-300" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
