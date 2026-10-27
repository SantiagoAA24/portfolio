import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

function H2(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 className="h2-article note-prose-h2" {...props} />;
}

function H3(props: ComponentPropsWithoutRef<"h3">) {
  return <h3 className="h4 note-prose-h3" {...props} />;
}

function Paragraph(props: ComponentPropsWithoutRef<"p">) {
  return <p className="note-prose-p" {...props} />;
}

function Anchor(props: ComponentPropsWithoutRef<"a">) {
  return <a className="note-prose-a" {...props} />;
}

function UnorderedList(props: ComponentPropsWithoutRef<"ul">) {
  return <ul className="note-prose-list" {...props} />;
}

function OrderedList(props: ComponentPropsWithoutRef<"ol">) {
  return <ol className="note-prose-list note-prose-ol" {...props} />;
}

function ListItem(props: ComponentPropsWithoutRef<"li">) {
  return <li className="note-prose-li" {...props} />;
}

function Blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return <blockquote className="note-prose-blockquote" {...props} />;
}

function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return <pre className="note-prose-pre" {...props} />;
}

function Code(props: ComponentPropsWithoutRef<"code">) {
  const { className, ...rest } = props;
  const isBlock = className?.includes("language-");
  return (
    <code
      className={
        isBlock
          ? `note-prose-code-block ${className ?? ""}`
          : "note-prose-code-inline"
      }
      {...rest}
    />
  );
}

function FigurePlaceholder({ children }: { children?: ReactNode }) {
  return <div className="note-prose-figure">{children}</div>;
}

function CodeBlock({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="note-code-block">
      {label ? <div className="note-code-block__label">{label}</div> : null}
      <div className="note-code-block__body">{children}</div>
    </div>
  );
}

export const noteMdxComponents: MDXComponents = {
  h2: H2,
  h3: H3,
  p: Paragraph,
  a: Anchor,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  pre: Pre,
  code: Code,
  FigurePlaceholder,
  CodeBlock,
};
