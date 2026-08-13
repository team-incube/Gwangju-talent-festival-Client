// 사용처 없음 + 하드코딩된 ncloud URL 404. 되살릴 일 없으면 파일째 삭제
// "use client";
// 
// import { cn } from "@/shared/utils/cn";
// import { useEffect, useRef, useState } from "react";
// 
// export interface VideoProps {
//   link?: string;
//   className?: string;
//   visibleCaption?: boolean;
// }
// 
// const Video = ({
//   link = "https://kr.object.ncloudstorage.com/gwangju-talent-festival-bucket/video%20(2).mp4",
//   className,
//   visibleCaption = true,
// }: VideoProps) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
// 
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;
// 
//     setIsLoading(true);
//     setHasError(false);
// 
//     const handleLoadedData = () => {
//       setIsLoading(false);
//       video.play().catch(err => {
//         console.warn("Autoplay blocked:", err);
//       });
//     };
// 
//     const handleError = () => {
//       setIsLoading(false);
//       setHasError(true);
//       console.error("Video loading failed:", link);
//     };
// 
//     video.addEventListener("loadeddata", handleLoadedData);
//     video.addEventListener("error", handleError);
// 
//     video.load();
// 
//     return () => {
//       video.removeEventListener("loadeddata", handleLoadedData);
//       video.removeEventListener("error", handleError);
//     };
//   }, [link]);
// 
//   return (
//     <div className={cn("relative", "w-full", "h-full", "select-none", className)}>
//       <video
//         ref={videoRef}
//         className={cn("w-full", "h-full", "object-cover")}
//         autoPlay
//         muted
//         playsInline
//         preload="auto"
//         loop
//       >
//         <source src={link} type="video/mp4" />
//       </video>
// 
//       {/* 로딩 상태 */}
//       {isLoading && (
//         <div className={cn("absolute inset-0 bg-gray-100 flex items-center justify-center")}>
//           <div className={cn("text-gray-500")}>동영상 로딩중...</div>
//         </div>
//       )}
// 
//       {/* 에러 상태 */}
//       {hasError && (
//         <div className={cn("absolute inset-0 bg-gray-100 flex items-center justify-center")}>
//           <div className={cn("text-gray-500 text-center")}>
//             <p>동영상을 불러올 수 없습니다</p>
//             <p className="text-sm mt-2">네트워크 연결을 확인해주세요</p>
//           </div>
//         </div>
//       )}
// 
//       <div
//         className={cn(
//           "absolute",
//           "inset-0",
//           "select-none",
//           "bg-gradient-to-t",
//           "from-black/100",
//           "via-transparent",
//           "to-transparent",
//           "[background-position:0_30%]",
//         )}
//       />
// 
//       <div
//         className={cn(
//           "absolute",
//           "bottom-[12%]",
//           "left-0",
//           "w-full",
//           "px-4",
//           "mobile:bottom-[6%]",
//           "select-none",
//         )}
//       >
//         {visibleCaption && (
//           <div
//             className={cn(
//               "max-w-[1060px]",
//               "mx-auto",
//               "text-white",
//               "text-sm",
//               "rounded",
//               "flex",
//               "flex-col",
//               "gap-14",
//               "tablet:pl-20",
//               "mobile:pl-10",
//               "mobile:gap-0",
//               "select-none",
//             )}
//           >
//             <p
//               className={cn(
//                 "font-bold",
//                 "text-title1b",
//                 "tablet:text-body1b",
//                 "mobile:text-caption1b",
//                 "select-none",
//               )}
//             >
//               光탈페 (광주학생탈렌트페스티벌)
//             </p>
//             <p
//               className={cn(
//                 "text-title4r",
//                 "tablet:text-body3r",
//                 "mobile:text-caption3r",
//                 "!leading-[130%]",
//               )}
//             >
//               <span className={cn("inline-block")}>
//                 光탈페는 광주학생의회가 중심이 되어{"\u00A0"}
//               </span>
//               <span className={cn("inline-block")}>
//                 학생들이 재능을 펼치고 즐길 수 있도록 기획된
//               </span>
//               <span className={cn("block")}>학생주도형 오디션 프로그램입니다</span>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// 
// export default Video;
//