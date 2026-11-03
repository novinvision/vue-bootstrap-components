import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// Library build: ES modules only (Bootstrap 6 itself is ESM-only).
// Every module is preserved so bundlers can tree-shake and so the
// dynamic `import('bootstrap/js/dist/*.js')` calls stay lazy in the consumer's build.
export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.json', entryRoot: 'src', copyDtsFiles: true })
  ],
  build: {
    target: 'es2020',
    sourcemap: true,
    lib: { entry: { index: 'src/index.ts', plugin: 'src/plugin.ts', composables: 'src/composables.ts', 'plugins/toast': 'src/plugins/toast.ts', 'plugins/dialog': 'src/plugins/dialog.ts' }, formats: ['es'] },
    rollupOptions: {
      external: [/^vue($|\/)/, /^bootstrap($|\/)/, /^@floating-ui\//, /^vanilla-calendar-pro($|\/)/],
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' }
    }
  }
})
