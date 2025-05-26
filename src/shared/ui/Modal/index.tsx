import { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  className,
  overlayClassName,
  contentClassName,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        overlayClassName
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "p-24 bg-white border border-gray-300 rounded-lg shadow-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || icon || showCloseButton) && (
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-20">
              {icon}
              {title && <h3 className="text-body2b">{title}</h3>}
            </div>
            {showCloseButton && (
              <span className="cursor-pointer" onClick={onClose}>
                ✕
              </span>
            )}
          </div>
        )}

        <div className={cn(contentClassName)}>
          {children}
        </div>

        {footer && (
          <div className="mt-12">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
} 