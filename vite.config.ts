// The shared Vite/TanStack config already includes several plugins — do NOT add them manually
// or the app may break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The preview environment provisions the dev server on the port exposed via
// DEV_PORT (falling back to 8080 for the Lovable sandbox). Bind the server to
// that port so the preview proxy can reach it.
const devPort = Number(process.env.DEV_PORT) || 8080;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      port: devPort,
    },
  },
});
