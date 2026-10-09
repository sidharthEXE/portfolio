import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "gsap/SplitText": "/src/plugins/SplitText.js",
      "gsap/ScrollSmoother": "/src/plugins/ScrollSmoother.js",
      "gsap-trial/SplitText": "/src/plugins/SplitText.js",
      "gsap-trial/ScrollSmoother": "/src/plugins/ScrollSmoother.js",
    },
  },
});
