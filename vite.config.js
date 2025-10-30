import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve:{
		alias:{
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],
					'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
					'supabase-vendor': ['@supabase/supabase-js'],
				}
			}
		}
	}
});
