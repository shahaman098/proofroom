import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({
 server:{allowedHosts:['terminal.local']},
 build:{rollupOptions:{input:{main:fileURLToPath(new URL('./index.html',import.meta.url)),blog:fileURLToPath(new URL('./blog/index.html',import.meta.url))}}}
});
