/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
/// <reference types="@types/ua-parser-js" />

declare module 'theme-change';

declare namespace NodeJS {
	interface ProcessEnv {
		MONGO_URI: string;
		ZOHO_USER: string;
		ZOHO_PASS: string;
		JWT_SECRET: string;
	}
}

declare namespace globalThis {
	// eslint-disable-next-line no-var
	var mongoose: any;
}

declare interface Navigator {
	// eslint-disable-next-line no-var
	connection: any;
}
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		user?: {
			id: string;
			email: string;
			scope: string;
			username?: string;
		};
	}

	// interface Platform {}

	interface Session {
		user?: {
			id: string;
			email: string;
			scope: string;
			username?: string;
		};
	}

	// interface Stuff {}
}
