import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import dotenv from 'dotenv';

dotenv.config();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			replace: [
				/* allows importing as import.meta.env.VERCEL_ANALYTICS_ID */
				['import.meta.env.VERCEL_ANALYTICS_ID', JSON.stringify(process.env.VERCEL_ANALYTICS_ID)]
			],
			postcss: true
		})
	],
	kit: {
		adapter: adapter({ external: ['@napi-rs/*'] })
	}
};

export default config;
