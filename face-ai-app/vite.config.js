import { defineConfig } from 'vite';

export default defineConfig({
  base: "./",
  build: {
    assetsDir: "./", // Mantén los archivos en la raíz de la carpeta `dist`
  },
});
