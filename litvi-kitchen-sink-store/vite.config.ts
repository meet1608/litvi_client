import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3002,
    // proxy: {
    //   '/api': {
    //     target: 'https://your-vercel-app.vercel.app', // Replace with your Vercel URL
    //     changeOrigin: true,
    //     secure: true,
    //   },
    // },
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none"
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000, // Increased chunk size limit
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'] // Improved code splitting
        }
      }
    }
  }
}));
