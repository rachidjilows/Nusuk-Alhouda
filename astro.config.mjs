import {defineConfig} from 'astro/config';
import tailwind from '@tailwindcss/vite';
export default defineConfig({site:'https://nusukalhouda.ma',trailingSlash:'always',vite:{plugins:[tailwind()]}});
