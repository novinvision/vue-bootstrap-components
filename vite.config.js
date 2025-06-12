import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'Vue3BootstrapComponents',
            formats: ['es', 'cjs'],
            fileName: (format) => `vue3-bootstrap-components.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [vue()]
});
