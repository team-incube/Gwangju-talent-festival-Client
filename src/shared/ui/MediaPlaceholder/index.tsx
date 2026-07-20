import { cn } from "@/shared/utils/cn";

interface MediaPlaceholderProps {
  label: string;
  description?: string;
  aspectRatio?: string;
  className?: string;
}

const MediaPlaceholder = ({
  label,
  description,
  aspectRatio = "16 / 9",
  className,
}: MediaPlaceholderProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center gap-6 rounded-lg",
        "border-2 border-dashed border-gray-300 bg-gray-50 text-center px-16",
        className,
      )}
      style={{ aspectRatio }}
    >
      <span className="text-body3b mobile:text-caption1b text-gray-500">{label}</span>
      {description && (
        <span className="text-caption1r mobile:text-caption2r text-gray-400 break-keep">
          {description}
        </span>
      )}
    </div>
  );
};

export default MediaPlaceholder;
