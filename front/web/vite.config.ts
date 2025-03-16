import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
	plugins: [react()],
	server: {
		host: "0.0.0.0",
		port: 5173, 
		strictPort: true,
		watch: {
			usePolling: true, 
		},
		hmr: {
			clientPort: 5173,
			protocol: "ws",
		},
		allowedHosts: [
			"localhost",
			"frontend",
		],
		origin: "http://127.0.0.1:5173",
	},
	build: {
		outDir: '../../build',
		emptyOutDir: true,
	},
})
