import { resolve } from "path";

// Handle actual environmental variables, https://github.com/vitejs/vite/issues/562
const viteEnv = {}
Object.keys(process.env).forEach((key) => {
  if (key.startsWith(`VITE_`)) {
    viteEnv[`import.meta.env.${key}`] = process.env[key]
  }
})

// Rest of config
export default {
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ],
  },
  define: viteEnv,
}
