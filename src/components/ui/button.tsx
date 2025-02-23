import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-zinc-300",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-text-200 shadow hover:bg-primary-600/90",
        destructive: "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90",
        outline: "border-2 border-text-500 shadow-sm text-text-600",
        secondary:
          "border-2 border-primary-500 text-primary-500 hover:text-text-200 hover:bg-primary-500",
        ghost: "hover:bg-zinc-100 hover:text-zinc-900",
        link: "text-text-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-3",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
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
