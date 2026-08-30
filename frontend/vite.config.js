import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableDevTools = env.VITE_ENABLE_DEVTOOLS === '1'

  const reactDevTools = {
    name: 'react-devtools-inject',
    apply: 'serve',
    transformIndexHtml() {
      if (!enableDevTools) return undefined
      return [{ tag: 'script', attrs: { src: 'http://localhost:8097' }, injectTo: 'head-prepend' }]
    },
  }

  const plugins = [react(), reactDevTools]
  if (mode === 'analyze') {
    plugins.push(visualizer({ open: true, gzipSize: true, filename: 'dist/stats.html' }))
  }

  return {
    plugins,
    server: {
      proxy: {
        '/users': 'http://localhost:3000',
        '/captains': 'http://localhost:3000',
        '/api-docs': 'http://localhost:3000',
      },
    },
  }
})