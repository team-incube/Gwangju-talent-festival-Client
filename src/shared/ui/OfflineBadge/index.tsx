import { cn } from "@/shared/utils/cn";

type OfflineBadgeProps = {
  className?: string;
};

const OfflineBadge = ({ className }: OfflineBadgeProps) => (
  <span
    role="status"
    className={cn(
      "inline-flex items-center gap-6 rounded-full bg-system-error/10 px-12 py-6 text-caption1b text-system-error",
      className,
    )}
  >
    오프라인 · 기기에 임시 저장 중
  </span>
);

export default OfflineBadge;
