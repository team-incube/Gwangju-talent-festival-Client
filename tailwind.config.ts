import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      fontSize: {
        h1: ["44px", { lineHeight: "120%", fontWeight: "500" }],
        h2: ["40px", { lineHeight: "120%", fontWeight: "500" }],
        h3: ["36px", { lineHeight: "120%", fontWeight: "500" }],
        h4b: ["32px", { lineHeight: "120%", fontWeight: "600" }],
        h4r: ["32px", { lineHeight: "120%", fontWeight: "400" }],
        title1b: ["44", { lineHeight: "120%", fontWeight: "700" }],
        body1b: ["24px", { lineHeight: "120%", fontWeight: "600" }],
        body1r: ["24px", { lineHeight: "120%", fontWeight: "400" }],
        body2b: ["20px", { lineHeight: "120%", fontWeight: "600" }],
        body2r: ["20px", { lineHeight: "150%", fontWeight: "400" }],
        body3b: ["16px", { lineHeight: "140%", fontWeight: "600" }],
        body3r: ["16px", { lineHeight: "160%", fontWeight: "400" }],
        caption1b: ["14px", { lineHeight: "150%", fontWeight: "600" }],
        caption1r: ["14px", { lineHeight: "150%", fontWeight: "400" }],
        caption2b: ["12px", { lineHeight: "150%", fontWeight: "600" }],
        caption2r: ["12px", { lineHeight: "150%", fontWeight: "400" }],
        caption3b: ["11px", { lineHeight: "180%", fontWeight: "600" }],
        caption3r: ["11px", { lineHeight: "180%", fontWeight: "400" }],
      },
      spacing: {
        "0": "0px",
        "1": "1px",
        "2": "2px",
        "4": "4px",
        "6": "6px",
        "8": "8px",
        "10": "10px",
        "12": "12px",
        "14": "14px",
        "16": "16px",
        "18": "18px",
        "20": "20px",
        "22": "22px",
        "24": "24px",
        "26": "26px",
        "28": "28px",
        "30": "30px",
      },
      borderRadius: {
        none: "0",
        sm: "0.375rem", // 6px
        md: "0.5rem", // 8px
        lg: "0.75rem", // 12px
        xl: "1rem", // 16px
        "2xl": "1.5rem", // 24px
        "3xl": "2rem", // 32px
        full: "9999px",
      },
      fontWeight: {
        medium: "500",
        semibold: "600",
        regular: "400",
      },
      colors: {
        main: {
          "100": "#F1E0F7",
          "200": "#E3C0EE",
          "300": "#D6A1E6",
          "400": "#C881DE",
          "500": "#BA62D5",
          "600": "#AC42CD",
        },
        gray: {
          "100": "#E9E9E9",
          "200": "#D3D3D3",
          "300": "#BDBDBD",
          "400": "#A7A7A7",
          "500": "#909090",
          "600": "#7A7A7A",
          "700": "#646464",
          "800": "#4E4E4E",
          "900": "#383838",
        },
        system: {
          success: "#27D211",
          error: "#E13A3A",
        },
        black: "#121212",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
} satisfies Config;
