import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-title2e",
        "text-title4s",
        "text-h1e",
        "text-h2e",
        "text-h3e",
        "text-h4e",
        "text-h4s",
        "text-body1e",
        "text-body1s",
        "text-body2e",
        "text-body2s",
        "text-body3e",
        "text-body3s",
        "text-caption1e",
        "text-caption1s",
        "text-caption2e",
        "text-caption2s",
        "text-caption3e",
        "text-caption3s",
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
