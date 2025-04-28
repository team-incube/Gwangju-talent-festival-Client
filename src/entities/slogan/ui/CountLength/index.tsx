import { cn } from "@/shared/utils/cn";

interface CountLengthProps {
  children: React.ReactNode;
  length?: number;
  max?: number;
}

export default function CountLength({
  children,
  length = 0,
  max = 100,
}: CountLengthProps) {
  return (
    <div className={cn("flex flex-col gap-4")}>
      {children}
      <span className={cn("text-body3r ml-auto text-gray-400")}>
        {length + "/" + max}
      </span>
    </div>
  );
}
