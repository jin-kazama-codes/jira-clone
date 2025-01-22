import { type Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        task: "#4bade8",
        story: "#68bc3c",
        bug: "#e84c3c",
        epic: "#984ce4",
        inprogress: "#0854cc",
        done: "#08845c",
        todo: "#d4d4d8",
        header: " #264653",
        button: "#264653",
        buttonHover: "#023047",
        body: "#5EDFFF",
        sidebar: "#ECFCFF",
        sprint: "#B2FCFF",
         // Dark theme colors
         dark: {
          0: "#4379c5",
          10: "#5d87cc",
          20: "#7495d2",
          30: "#89a3d9",
          40: "#9db2df",
          50: "#b1c1e6",
        },
        darkSprint: {
          0: "#121420",
          10: "#282935",
          20: "#3f404b",
          30: "#575862",
          40: "#71727a",
          50: "#8b8c93",
        },
        darkButton: {
          0: "#171d2e",
          10: "#2d3242",
          20: "#444857",
          30: "#5c5f6d",
          40: "#757884",
          50: "#8f919b",
        },
      },
      backgroundImage: {
        "custom-background": `
          linear-gradient(125deg, #ECFCFF 0%, #ECFCFF 40%, 
          #B2FCFF calc(40% + 1px), #B2FCFF 60%, 
          #3E64FF calc(60% + 1px), #3E64FF 72%, 
          #5EDFFF calc(72% + 1px), #5EDFFF 100%)
        `,
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("tailwindcss-animate"),
  ],
} satisfies Config;
