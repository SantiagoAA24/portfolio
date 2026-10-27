import type {
  AnchorHTMLAttributes,
  FormHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

type BaseProps = {
  dashed?: boolean;
  children: ReactNode;
  className?: string;
};

type CardAsDiv = BaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> & {
    as?: "div";
    href?: undefined;
  };

type CardAsArticle = BaseProps &
  Omit<HTMLAttributes<HTMLElement>, "children" | "className"> & {
    as: "article";
    href?: undefined;
  };

type CardAsForm = BaseProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, "children" | "className"> & {
    as: "form";
    href?: undefined;
  };

type CardAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    as?: "a";
    href: string;
  };

export type CardProps = CardAsDiv | CardAsArticle | CardAsForm | CardAsAnchor;

function cardClassName(dashed: boolean | undefined, className?: string): string {
  const base = dashed ? "card card-dashed" : "card";
  return className ? `${base} ${className}` : base;
}

export function Card(props: CardProps) {
  const { dashed, children, className, as = "div", ...rest } = props;
  const classes = cardClassName(dashed, className);

  if (as === "a" || ("href" in props && props.href !== undefined)) {
    const { href, ...anchorRest } = rest as Omit<
      CardAsAnchor,
      "dashed" | "children" | "className" | "as"
    >;
    return (
      <a href={href ?? "#"} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  if (as === "article") {
    const articleRest = rest as Omit<
      CardAsArticle,
      "dashed" | "children" | "className" | "as"
    >;
    return (
      <article className={classes} {...articleRest}>
        {children}
      </article>
    );
  }

  if (as === "form") {
    const formRest = rest as Omit<
      CardAsForm,
      "dashed" | "children" | "className" | "as"
    >;
    return (
      <form className={classes} {...formRest}>
        {children}
      </form>
    );
  }

  const divRest = rest as Omit<
    CardAsDiv,
    "dashed" | "children" | "className" | "as"
  >;
  return (
    <div className={classes} {...divRest}>
      {children}
    </div>
  );
}
