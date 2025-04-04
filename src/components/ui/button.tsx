import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-zinc-300",
  {
    variants: {
      variant: {
        default:
          "border border-primary-500 bg-primary-500 text-text-200 shadow hover:bg-primary-600/90",
        destructive: "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90",
        outline: "border border-text-500 shadow-sm text-text-600",
        secondary:
          "border border-primary-500 text-primary-500 hover:text-text-200 hover:bg-primary-500",
        ghost: "hover:bg-zinc-100 hover:text-zinc-900",
        link: "underline-offset-4 hover:underline",
        whiteDefault: "bg-white text-blue-600 hover:bg-gray-100",
        whiteOutline: "border border-white text-white hover:bg-white hover:text-blue-600",
      },
      size: {
        default: "px-6 py-[0.6875rem] text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8 py-7 text-base md:text-lg",
        icon: "h-9 w-9",
        link: "w-fit h-fit p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
