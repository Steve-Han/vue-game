import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
//import {createVuePlugin} from 'vite-plugin-vue2';
//import {vitePlugin as VitePluginSass} from 'vite-plugin-sass';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        //createVuePlugin(),
        //VitePluginSass(),
    ],
})
