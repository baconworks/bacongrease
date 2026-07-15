import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const here = dirname( fileURLToPath( import.meta.url ) );

// Component stylesheets resolve the design system with bare specifiers
// (`@use 'mixins'`, `@use 'functions'`, …). At build time we reproduce the
// same loadPaths Storybook uses so those `@use`s resolve. See CLAUDE.md.
const stylesSrc = resolve( here, '../styles/src' );

// react, react-dom and react-icons (incl. subpaths like react-icons/fa) are
// peer deps — never bundle them into the library.
const external = [ /^react($|\/)/, /^react-dom($|\/)/, /^react-icons($|\/)/ ];

export default defineConfig( {
  // No @vitejs/plugin-react: this is a library build (no dev/fast-refresh), and
  // Vite's esbuild transpiles TSX via the automatic JSX runtime configured by
  // tsconfig's `"jsx": "react-jsx"`. That also keeps us off plugin-react's
  // Vite-version peer constraints.
  plugins: [
    dts( {
      include: [ 'src' ],
      exclude: [ 'src/**/*.stories.tsx', 'src/**/*.test.tsx' ],
      insertTypesEntry: true,
    } ),
  ],
  css: {
    preprocessorOptions: {
      scss: { loadPaths: [ stylesSrc ] },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: resolve( here, 'src/index.ts' ),
      formats: [ 'es', 'cjs' ],
      fileName: ( format ) => ( format === 'es' ? 'index.js' : 'index.cjs' ),
      cssFileName: 'style',
    },
    rollupOptions: { external },
  },
} );
