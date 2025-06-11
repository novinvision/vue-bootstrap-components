import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'Vue3BootstrapComponents',
            fileName: () => 'vue3-bootstrap-components.mjs',
            formats: ['es']
        },
        rollupOptions: {
            external: ['vue', 'bootstrap'],
        }
    }
});
