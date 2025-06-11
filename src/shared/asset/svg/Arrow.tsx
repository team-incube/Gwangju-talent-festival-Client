import { SvgProps } from "@/shared/model/SvgProps";

interface ArrowProps extends SvgProps {
  text?: string;
}

const Arrow = ({
  width = 167,
  height = 108,
  color = "#F1E0F7",  
  text,
}: ArrowProps) => {
  return (
    <div className="relative">
      <svg width={width} height={height} viewBox="0 0 167 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.35038 12.1427C-1.877 6.81115 1.96184 0 8.19418 0H77.9827H130.358C133.126 0 135.697 1.43064 137.156 3.78258L165.408 49.3214C166.998 51.8844 167.011 55.1238 165.442 57.6999L137.147 104.161C135.695 106.545 133.106 108 130.314 108H77.9827H8.19418C1.96185 108 -1.877 101.189 1.35039 95.8572L24.1801 58.1428C25.7217 55.596 25.7217 52.404 24.1801 49.8572L1.35038 12.1427Z" fill={color}/>
      </svg>
      <div className="absolute inset-0 flex flex-col justify-center px-8 ml-16">
        <div className="flex flex-col gap-1 text-center">
          {text && (
            <div className="text-caption1b font-bold">
              {text.split('n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx !== text.split('n').length - 1 && <br />}
                </span>
              ))}
            </div>
          )}
        </div>  
      </div>
    </div>
  );
};

export default Arrow;