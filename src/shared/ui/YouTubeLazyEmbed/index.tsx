"use client";

import { cn } from "@/shared/utils/cn";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import dynamic from "next/dynamic";

const Youtube = dynamic(() => import("@/shared/asset/svg/Youtube"), {
  ssr: false,
  loading: () => (
    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

interface YouTubeLazyEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
}

const YouTubeLazyEmbed = ({ videoId, title, className, autoPlay = false }: YouTubeLazyEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: true,
  });

  // autoPlay는 사용자 클릭 없이 재생되므로 브라우저 자동재생 정책상 음소거 필수
  useEffect(() => {
    if (autoPlay && inView) setIsLoaded(true);
  }, [autoPlay, inView]);

  const thumbnailUrl = useMemo(
    () => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    [videoId],
  );

  const blurDataURL = useMemo(
    () =>
      `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`,
    [],
  );
  const handlePlay = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden cursor-pointer",
        className,
      )}
    >
      {!isLoaded ? (
        <div className="relative w-full h-full group" onClick={handlePlay}>
          {inView && (
            <div className="relative w-full h-full">
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                quality={85}
              />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-28 h-28 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Youtube />
            </div>
          </div>

          {!inView && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm">동영상 준비 중...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${autoPlay ? "&mute=1" : ""}`}
          title={title}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};

export default YouTubeLazyEmbed;
