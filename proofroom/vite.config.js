import {defineConfig} from 'vite';
// The QuickCart backend (demo-app, `npm start`) has no CORS, so the dev and preview servers proxy /api to it.
const target = process.env.QUICKCART_URL || 'http://localhost:3000';
const proxy = {'/api': {target, changeOrigin: true}};
export default defineConfig({server:{allowedHosts:['terminal.local'],proxy},preview:{proxy}});
