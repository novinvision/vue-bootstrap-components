import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'VueBootstrapComponents',
            fileName: 'vue3-bootstrap-components',
            formats: ['es'] // فقط ESM
        },
        rollupOptions: {
            external: ['vue', 'bootstrap'],
        }
    }
});