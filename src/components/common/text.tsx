type Weight = "medium" | "semibold" | "bold";
type Size =
  | "large1"
  | "large2"
  | "large3"
  | "title1"
  | "title2"
  | "title3"
  | "headline"
  | "body"
  | "callout"
  | "subheadline"
  | "footnote"
  | "caption";

type Variant = Size | `${Size}-${Exclude<Weight, "medium">}`;

interface TypographyProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<Variant, string> = {
  // Large headings (60px - 40px)
  large1: "text-6xl font-medium",
  "large1-semibold": "text-6xl font-semibold",
  "large1-bold": "text-6xl font-bold",

  large2: "text-5xl font-medium",
  "large2-semibold": "text-5xl font-semibold",
  "large2-bold": "text-5xl font-bold",

  large3: "text-4xl font-medium",
  "large3-semibold": "text-4xl font-semibold",
  "large3-bold": "text-4xl font-bold",

  // Title headings (36px - 30px)
  title1: "text-3xl font-medium",
  "title1-semibold": "text-3xl font-semibold",
  "title1-bold": "text-3xl font-bold",

  title2: "text-2xl font-medium",
  "title2-semibold": "text-2xl font-semibold",
  "title2-bold": "text-2xl font-bold",

  title3: "text-xl font-medium",
  "title3-semibold": "text-xl font-semibold",
  "title3-bold": "text-xl font-bold",

  // Content text (24px - 16px)
  headline: "text-lg font-medium",
  "headline-semibold": "text-lg font-semibold",
  "headline-bold": "text-lg font-bold",

  body: "text-base font-medium",
  "body-semibold": "text-base font-semibold",
  "body-bold": "text-base font-bold",

  // Small text (14px - 12px)
  callout: "text-sm font-medium",
  "callout-semibold": "text-sm font-semibold",
  "callout-bold": "text-sm font-bold",

  subheadline: "text-xs font-medium",
  "subheadline-semibold": "text-xs font-semibold",
  "subheadline-bold": "text-xs font-bold",

  footnote: "text-[10px] font-medium",
  "footnote-semibold": "text-[10px] font-semibold",
  "footnote-bold": "text-[10px] font-bold",

  caption: "text-[9px] font-medium",
  "caption-semibold": "text-[9px] font-semibold",
  "caption-bold": "text-[9px] font-bold",
} as const;

const getElement = (variantType: Variant): keyof JSX.IntrinsicElements => {
  const variantPrefix = variantType.split("-")[0] as Size;

  switch (variantPrefix) {
    case "large1":
    case "large2":
    case "large3":
      return "h1";
    case "title1":
    case "title2":
    case "title3":
      return "h2";
    case "headline":
      return "h3";
    case "caption":
      return "span";
    default:
      return "p";
  }
};

export const Text: React.FC<TypographyProps> = ({
  variant = "body",
  children,
  className = "",
}) => {
  const Element = getElement(variant);
  const styleClasses = styles[variant];

  return (
    <Element className={`${styleClasses} ${className}`}>{children}</Element>
  );
};
