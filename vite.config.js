import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Memuat file .env sesuai mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // components: path.resolve(__dirname, "./src/components"),
      },
    },
    define: {
      // Memastikan variabel environment tersedia di runtime
      "process.env": env,
    },
  };
});
