import Icons from 'unplugin-icons/vite';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	]
};

export default config;
