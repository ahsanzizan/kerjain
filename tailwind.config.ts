import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "primary-100": "#D3E4FE",
        "primary-200": "#A7C9FE",
        "primary-300": "#7BADFD",
        "primary-400": "#4F92FD",
        "primary-500": "#2277FB",
        "primary-600": "#1C5FC9",
        "primary-700": "#154797",
        "primary-800": "#0E3065",
        "primary-900": "#0E3065",

        "text-200": "#F9F9F9",
        "text-300": "#BABABA",
        "text-400": "#959595",
        "text-500": "#4C4C4C",
        "text-600": "#313131",
        "text-700": "#1F1F1F",

        "background-200": "#F9F9F9",
        "background-300": "#F7F7F7",
        "background-400": "#F5F5F5",
        "background-500": "#EFEFEF",
        "background-600": "#EBEBEB",
        "background-700": "#E6E6E6",

        "success-200": "#EBFCD8",
        "success-300": "#D3FAB2",
        "success-400": "#B1F188",
        "success-500": "#60D13A",
        "success-600": "#2A961D",
        "success-700": "#0B640D",

        "info-200": "#E3ECFC",
        "info-300": "#C8D7FB",
        "info-400": "#ABC1F9",
        "info-500": "#7291F5",
        "info-600": "#3A50AF",
        "info-700": "#162573",

        "warning-200": "#FEFBCC",
        "warning-300": "#FEF69A",
        "warning-400": "#FEF068",
        "warning-500": "#FCDF05",
        "warning-600": "#B59C02",
        "warning-700": "#786400",

        "danger-200": "#FFE6D6",
        "danger-300": "#FFC7AD",
        "danger-400": "#FFA283",
        "danger-500": "#FF4332",
        "danger-600": "#B71926",
        "danger-700": "#7A0925",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
