import protect from '$lib/_auth/protect';
import { Category } from '$lib/_db/models/Category';
import { CategoryPOSTType } from '$lib/const';
import type { RequestHandler } from '@sveltejs/kit';
import type { APICatPOST, JWTPayload } from '$lib/types';
import { castToObjectId } from '$lib/_db/controllers/utils';
import { getPaginatedCats } from '$lib/_db/controllers/category';
import type { CategoryObject } from '$lib/_db/mongoose.gen';

export const GET: RequestHandler = async ({ url }) => {
	if (url.searchParams.get('type') === 'all') {
		const categories = await Category.getCatList();
		if (categories) {
			return {
				body: {
					categories
				}
			};
		}
		return {
			/* TODO: determine best response if no categories */
			status: 500
		};
	} else {
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
	}
};

export const POST: RequestHandler = async ({ request }) => {
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

	const { id, name, type } = (await request.json()) as APICatPOST;
	if (type === CategoryPOSTType.ADD) {
		return Category.addCat(name)
			.then((cat: CategoryObject) => {
				return {
					status: 200,
					body: {
						cat
					}
				};
			})
			.catch((err: Error) => {
				return {
					status: 503,
					body: {
						error: err.message
					}
				};
			});
	} else {
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
	}
};
