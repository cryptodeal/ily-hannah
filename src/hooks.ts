import type { Handle } from '@sveltejs/kit';
import decodeToken from '$lib/_auth/decodeToken';
import refreshAuth from '$lib/_auth/refreshAuth';
import cookie from 'cookie';
import config from '$lib/_config';
import { serverlessConnect } from '$lib/_db/connect';

export const handle: Handle = async ({ event, resolve }) => {
	await serverlessConnect(config.MONGO_URI);
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	let refreshedAccessToken: undefined | string = undefined;

	if (!cookies['accessToken'] && cookies['refreshToken']) {
		refreshedAccessToken = await refreshAuth(cookies);
	}

	//if request has accessToken JWT, set claims as request.locals.user
	if (cookies.accessToken || refreshedAccessToken) {
		const decoded = decodeToken(cookies.accessToken);
		if (decoded) {
			const { payload } = decoded;
			event.locals.user = payload as {
				id: string;
				email: string;
				scope: string;
				username?: string;
			};
		}
	}

	const response = await resolve(event);
	if (refreshedAccessToken) response.headers.set('set-cookie', refreshedAccessToken);

	if (!cookies['accessToken'] && refreshedAccessToken) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set('set-cookie', refreshedAccessToken);
	}

	return response;
};
