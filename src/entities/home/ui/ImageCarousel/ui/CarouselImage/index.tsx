import { memo } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";

type CarouselImageProps = Readonly<{
  src: string;
  idx: number;
  aspectRatio: string;
}>;

export const CarouselImage = memo(({ src, idx, aspectRatio }: CarouselImageProps) => (
  <div
    key={`slide-${idx}`}
    className={cn("relative w-full h-full flex-shrink-0", aspectRatio)}
    style={{ minWidth: "100%" }}
  >
    <Image src={src} alt={`${idx}`} fill className="object-cover rounded-lg" priority={idx === 0} />
  </div>
));
CarouselImage.displayName = "CarouselImage";
