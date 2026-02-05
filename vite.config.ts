import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@api": "/src/api",
      "@features": "/src/features",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@types": "/src/types",
      "@assets": "/src/assets",
    },
  },
});
