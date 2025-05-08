import { cn } from "@/shared/utils/cn";
import { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeholder, label, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-8">
        <label className="text-body3b">{label}</label>
        <textarea
          className={cn(
            "w-full outline-none rounded-md p-12 text-body3r placeholder:text-gray-400 overflow-y-scroll focus:ring-0 transition-all h-[150px] border border-gray-100 resize-none",
            className
          )}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
