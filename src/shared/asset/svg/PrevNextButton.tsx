import { SvgProps } from "@/shared/model/SvgProps";
import React from "react";

interface PrevNextButtonProps extends SvgProps {
  next?: boolean;
}

export const PrevNextButton = ({
  height = 45,
  width = 45,
  color = "#121212",
  next = false,
  ...props
}: PrevNextButtonProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={` ${next ? "rotate-180" : ""}`}
      {...props}
    >
      <rect x="0.5" y="0.5" width="44" height="44" rx="22" fill="white" fillOpacity="0.5" />
      <path
        d="M27.12 31.5098C26.63 31.9998 25.84 31.9998 25.35 31.5098L17.04 23.1998C16.9473 23.1073 16.8738 22.9974 16.8236 22.8764C16.7734 22.7555 16.7476 22.6258 16.7476 22.4948C16.7476 22.3638 16.7734 22.2342 16.8236 22.1132C16.8738 21.9922 16.9473 21.8823 17.04 21.7898L25.35 13.4798C25.84 12.9898 26.63 12.9898 27.12 13.4798C27.61 13.9698 27.61 14.7598 27.12 15.2498L19.88 22.4998L27.13 29.7498C27.61 30.2298 27.61 31.0298 27.12 31.5098Z"
        fill={color}
      />
    </svg>
  );
};
