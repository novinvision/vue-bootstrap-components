import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        vue(),
        dts()
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'Vue3BootstrapComponents',
            fileName: 'index'
        },
        rollupOptions: {
            external: ['vue', 'bootstrap']
        }
    }
})