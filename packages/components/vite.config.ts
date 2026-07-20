import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';

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
    // Preserve each source module's `'use client'` directive through the bundle (per-module), so
    // interactive components are client boundaries while pure utils (cleanClasses) stay server-safe —
    // importable into Next.js (App Router) Server Components. Replaces a blanket 'use client' banner.
    preserveDirectives(),
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
      cssFileName: 'style',
    },
    rollupOptions: {
      external,
      // Emit one file per source module (preserveModules) so rollup-preserve-directives keeps each
      // module's own `'use client'`: interactive components are client boundaries, pure utils
      // (cleanClasses) stay server-safe. A per-format output ARRAY is required — `entryFileNames`
      // receives the chunk (which has no `format`), so we can't pick the extension from a callback.
      // The barrel (src/index.ts → dist/index.js|.cjs) still re-exports everything; `exports` unchanged.
      output: [
        { format: 'es', preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
        { format: 'cjs', preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].cjs', exports: 'named' },
      ],
    },
  },
} );
