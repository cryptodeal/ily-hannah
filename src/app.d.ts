/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
/// <reference types="@types/ua-parser-js" />

declare module 'theme-change';

declare namespace NodeJS {
	interface ProcessEnv {
		MONGO_URI: string;
	}
}

declare namespace globalThis {
	// eslint-disable-next-line no-var
	var mongoose: any;
}
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string;
	}

	// interface Platform {}

	// interface Session {}

	// interface Stuff {}
}
