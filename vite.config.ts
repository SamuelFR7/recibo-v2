import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { flatRoutes } from 'remix-flat-routes'
import inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  plugins: [
    remix({
      ssr: false,
      ignoredRouteFiles: ['**/*'],
      routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes)
      },
    }),
    tsconfigPaths(),
    inspect(),
  ],
})
