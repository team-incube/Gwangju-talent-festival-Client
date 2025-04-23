import { cn } from "@/shared/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input = ({ className, type, placeholder, label, ...props }: InputProps) => {
  return (
    <div className="w-full">
      <label className="text-sm font-medium">{label}</label>
      <input
      className={cn(
        "w-full border-none outline-none rounded-md px-16 py-4 text-body3r placeholder:text-gray-400 focus:ring-0 transition-all h-[50px] bg-gray-100",
        className
      )}
      placeholder={placeholder}
      type={type}
      {...props}
    />
    </div>
  );
};

export default Input;
