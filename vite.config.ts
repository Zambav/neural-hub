import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Enable rollup chunking for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'postprocessing': ['@react-three/postprocessing'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Generate source maps for debugging (set to false for production)
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Improve chunk splitting
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
    // Pre-bundle these for faster dev builds
    esbuildOptions: {
      target: 'esnext',
    },
  },
  // Server performance
  server: {
    hmr: {
      overlay: true,
    },
  },
})