import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';
import config from '$lib/_config';
import { serverlessConnect } from '$lib/_db/connect';

export const handle: Handle = async ({ event, resolve }) => {
	await serverlessConnect(config.MONGO_URI);
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.userid = cookies['userid'] || crypto.randomUUID();

	const response = await resolve(event);

	if (!cookies['userid']) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', event.locals.userid, {
				path: '/',
				httpOnly: true
			})
		);
	}

	return response;
};
