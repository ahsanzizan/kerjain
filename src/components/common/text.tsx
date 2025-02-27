type Weight = "medium" | "semibold" | "bold";
type Size =
  | "xlarge"
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
  xlarge: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium",
  "xlarge-semibold":
    "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold",
  "xlarge-bold": "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold",
  // Large headings
  large1: "text-4xl sm:text-5xl md:text-6xl font-medium",
  "large1-semibold": "text-4xl sm:text-5xl md:text-6xl font-semibold",
  "large1-bold": "text-4xl sm:text-5xl md:text-6xl font-bold",
  large2: "text-3xl sm:text-4xl md:text-5xl font-medium",
  "large2-semibold": "text-3xl sm:text-4xl md:text-5xl font-semibold",
  "large2-bold": "text-3xl sm:text-4xl md:text-5xl font-bold",
  large3: "text-2xl sm:text-3xl md:text-4xl font-medium",
  "large3-semibold": "text-2xl sm:text-3xl md:text-4xl font-semibold",
  "large3-bold": "text-2xl sm:text-3xl md:text-4xl font-bold",
  // Title headings
  title1: "text-xl sm:text-2xl md:text-3xl font-medium",
  "title1-semibold": "text-xl sm:text-2xl md:text-3xl font-semibold",
  "title1-bold": "text-xl sm:text-2xl md:text-3xl font-bold",
  title2: "text-lg sm:text-xl md:text-2xl font-medium",
  "title2-semibold": "text-lg sm:text-xl md:text-2xl font-semibold",
  "title2-bold": "text-lg sm:text-xl md:text-2xl font-bold",
  title3: "text-base sm:text-lg md:text-xl font-medium",
  "title3-semibold": "text-base sm:text-lg md:text-xl font-semibold",
  "title3-bold": "text-base sm:text-lg md:text-xl font-bold",
  // Content text
  headline: "text-base sm:text-lg font-medium",
  "headline-semibold": "text-base sm:text-lg font-semibold",
  "headline-bold": "text-base sm:text-lg font-bold",
  body: "text-sm sm:text-base font-medium",
  "body-semibold": "text-sm sm:text-base font-semibold",
  "body-bold": "text-sm sm:text-base font-bold",
  // Small text
  callout: "text-xs sm:text-sm font-medium",
  "callout-semibold": "text-xs sm:text-sm font-semibold",
  "callout-bold": "text-xs sm:text-sm font-bold",
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
    case "xlarge":
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
