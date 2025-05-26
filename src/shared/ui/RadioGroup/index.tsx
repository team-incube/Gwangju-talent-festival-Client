import { cn } from "@/shared/utils/cn";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  optionClassName?: string;
  labelClassName?: string;
}

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  className,
  optionClassName,
  labelClassName,
}: RadioGroupProps) {
  return (
    <div className={cn("mb-24 ml-24", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex gap-8 mb-6 items-center cursor-pointer last:mb-0",
            optionClassName
          )}
        >
          <input
            type="radio"
            name={name}
            className="accent-black text-body3r scale-100"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className={cn("text-lg", labelClassName)}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
} 