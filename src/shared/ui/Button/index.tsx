import { cn } from "@/shared/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isDisabled?: boolean;
};

const Button = ({ children, className, onClick, isDisabled = false, ...props }: ButtonProps) => {
  return (
    <>
      <button
        className={cn(
          `px-4 py-2 rounded-md text-sm whitespace-nowrap text-white ${isDisabled ? "bg-gray-300" : "bg-main-600"}`,
          className
        )}
        onClick={onClick}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
