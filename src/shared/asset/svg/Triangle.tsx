import { SvgProps } from "@/shared/model/SvgProps";

interface TriangleProps extends SvgProps {
  direction?: "up" | "down";
}

const Triangle = ({ width = 16, height = 16, color = "#7A7A7A", direction = "up" }: TriangleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      className={direction === "down" ? "rotate-180" : undefined}
    >
      <path d="M10 3L18 17H2L10 3Z" fill={color} />
    </svg>
  );
};

export default Triangle;
