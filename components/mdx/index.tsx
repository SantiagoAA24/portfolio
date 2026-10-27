import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Callout } from "@/components/Callout";
import { Chip } from "@/components/Chip";
import { Label } from "@/components/Label";
import { Pipeline } from "@/components/Pipeline";
import { Stat } from "@/components/Stat";

function H2(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 className="h2-article" {...props} />;
}

function H3(props: ComponentPropsWithoutRef<"h3">) {
  return <h3 className="h4" {...props} />;
}

function H4(props: ComponentPropsWithoutRef<"h4">) {
  return <h4 className="h4" {...props} />;
}

function Paragraph(props: ComponentPropsWithoutRef<"p">) {
  return <p className="body-lg case-prose-p" {...props} />;
}

function Anchor(props: ComponentPropsWithoutRef<"a">) {
  return <a className="case-prose-a" {...props} />;
}

function UnorderedList(props: ComponentPropsWithoutRef<"ul">) {
  return <ul className="case-prose-list" {...props} />;
}

function OrderedList(props: ComponentPropsWithoutRef<"ol">) {
  return <ol className="case-built-list" {...props} />;
}

function ListItem(props: ComponentPropsWithoutRef<"li">) {
  return <li className="case-built-item" {...props} />;
}

function Section({
  id,
  number,
  children,
}: {
  id: string;
  number: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="case-section">
      <span className="case-section-num">{number}</span>
      {children}
    </section>
  );
}

function Decisions({ children }: { children: ReactNode }) {
  return <div className="case-decisions">{children}</div>;
}

function Stats({ children }: { children: ReactNode }) {
  return <div className="case-stats">{children}</div>;
}

function BuiltWith({ children }: { children: ReactNode }) {
  return <div className="case-built-with">{children}</div>;
}

export const mdxComponents: MDXComponents = {
  h2: H2,
  h3: H3,
  h4: H4,
  p: Paragraph,
  a: Anchor,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  Callout,
  Pipeline,
  Stat,
  Chip,
  Label,
  Section,
  Decisions,
  Stats,
  BuiltWith,
};
