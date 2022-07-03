import protect from '$lib/_auth/protect';
import { Category } from '$lib/_db/models/Category';
import type { RequestHandler } from '@sveltejs/kit';
import type { APICatPOST, JWTPayload } from '$lib/types';
import { castToObjectId } from '$lib/_db/controllers/utils';
import { getPaginatedCats } from '$lib/_db/controllers/category';

export const get: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('pg') || 1;
	const data = await getPaginatedCats(Number(page));
	if (data) {
		return {
			body: data
		};
	}
	return {
		/* TODO: determine best response if no categories */
		status: 500
	};
};

export const post: RequestHandler = async ({ request }) => {
	/* auth first; save category only if auth ;) */
	const userAuth = (await protect(request.headers)) as JWTPayload;
	if (!userAuth) {
		return {
			status: 401,
			body: {
				error: 'Must login to post to POST to /api/content'
			}
		};
	}

	const { id, name } = (await request.json()) as APICatPOST;
	const cat = await Category.addOrUpdateCat(name, id ? castToObjectId(id) : undefined);
	if (cat) {
		return {
			status: 200,
			body: {
				category: cat
			}
		};
	} else {
		return {
			status: 503
		};
	}
};
