import { SvgProps } from "@/shared/model/SvgProps";

export const NaverLogo = ({
  width = 16,
  height = 16,
  color = "#FFF",
}: SvgProps) => {
  return (<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8487 8.56333L4.91733 0H0V16H5.15067V7.43733L11.0827 16H16V0H10.8487V8.56333Z" fill={color}/>
    </svg>
    )
}