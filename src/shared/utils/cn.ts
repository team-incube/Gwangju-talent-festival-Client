import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4b",
        "text-h4r",
        "text-title1b",
        "text-title2b",
        "text-title3m",
        "text-title4b",
        "text-title4r",
        "text-body1b",
        "text-body1r",
        "text-body2b",
        "text-body2r",
        "text-body3b",
        "text-body3r",
        "text-caption1b",
        "text-caption1r",
        "text-caption2b",
        "text-caption2r",
        "text-caption3b",
        "text-caption3r",
      ],
      "text-color": [
        "text-black",
        "text-white",
        { "text-main": ["100", "200", "300", "400", "500", "600"] },
        { "text-gray": ["100", "200", "300", "400", "500", "600", "700"] },
        { "text-system": ["success", "error"] },
      ],
      opacity: ["bg-opacity-50"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
