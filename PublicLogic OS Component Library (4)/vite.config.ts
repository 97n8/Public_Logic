import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load envs explicitly (helps with demo + M365 clarity)
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isDemo = env.VITE_DEMO_MODE === 'true';

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    assetsInclude: [
      '**/*.svg',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif',
      '**/*.woff2',
    ],

    server: {
      port: 3000,
      host: true,

      // Makes M365 redirect URIs happier in dev
      strictPort: true,

      // Better DX for auth / SharePoint redirects
      fs: {
        strict: false,
      },
    },

    build: {
      outDir: 'dist',
      target: 'es2022',

      // Keep your existing behavior
      minify: isProduction ? 'esbuild' : false,

      sourcemap: !isProduction,

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'lucide-react'],
          },
        },
      },
    },

    define: {
      // Keep your existing define
      'process.env.NODE_ENV': JSON.stringify(mode),

      // Helpful runtime flags (tree-shakeable)
      __DEMO_MODE__: JSON.stringify(isDemo),
      __BUILD_MODE__: JSON.stringify(mode),
    },

    // Prevents accidental leaks in production
    envPrefix: 'VITE_',
  };
});
