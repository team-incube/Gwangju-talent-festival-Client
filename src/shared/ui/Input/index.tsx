import { cn } from "@/shared/utils/cn";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, placeholder, label, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="text-body3b">{label}</label>
        <input
          className={cn(
            "w-full border-none outline-none rounded-md px-16 py-4 text-body3r placeholder:text-gray-400 focus:ring-0 transition-all h-[50px] bg-gray-100",
            type === "number" &&
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            className
          )}
          placeholder={placeholder}
          type={type}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
