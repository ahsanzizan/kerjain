import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface BottomBorderInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const BottomBorderInput = forwardRef<HTMLInputElement, BottomBorderInputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <Input
          type={isPasswordType ? (showPassword ? "text" : "password") : type}
          className={cn(
            "border-input border-text-300 bg-background-300 h-12 rounded-none border-0 border-b px-4 focus-visible:ring-0 focus-visible:ring-offset-0",
            "hover:border-text-700 focus:border-text-700",
            isPasswordType && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {isPasswordType && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="text-primary-500 h-4 w-4" />
            ) : (
              <Eye className="text-primary-500 h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        )}
      </div>
    );
  },
);

BottomBorderInput.displayName = "BottomBorderInput";

export { BottomBorderInput };
