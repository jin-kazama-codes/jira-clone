import { type Config } from "tailwindcss";

export default {
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
