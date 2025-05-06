import { SVGProps } from "react";

export type SvgProps = SVGProps<SVGSVGElement> & {
  height?: number;
  width?: number;
  color?: string;
};
