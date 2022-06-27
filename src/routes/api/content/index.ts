import type { RequestHandler } from '@sveltejs/kit';
import { Content } from '$lib/_db/models/Content';
import { castToObjectId } from '$lib/_db/controllers/utils';
import type { ContentDocument, ContentObject } from '$lib/_db/mongoose.gen';
import protect from '$lib/_auth/protect';
import type { JWTPayload } from '$lib/types';
import type { SaveContentData } from 'src/routes';
import { getPaginatedContent } from '$lib/_db/controllers/content';

type ContentDeleteForm = Record<string, string> & {
	ids: string[] | string;
};

export const get: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('pg');
	if (!page) throw new Error('page is required');
	const contentData = await getPaginatedContent(Number(page));
	contentData.itemList.map((i) => {
		i.checked = false;
		return i;
	});
	if (contentData) {
		return {
			body: {
				contentData: contentData as unknown as ContentObject[]
			}
		};
	}
	return {
		status: 500
	};
};

export const post: RequestHandler = async (event) => {
	/* auth first; save work if not auth ;) */
	const userAuth = (await protect(event.request.headers)) as JWTPayload;
	if (!userAuth) {
		return {
			status: 401,
			body: {
				error: 'Must login to save posts!'
			}
		};
	}

	const data = (await event.request.json()) as SaveContentData;
	const { _id, title, state, authors, content, categories } = data;
	const res = await Content.saveContent(title, authors, content, categories, state, _id);
	if (res) {
		return {
			status: 200
		};
	} else {
		return {
			status: 503
		};
	}
};

export const del: RequestHandler<ContentDeleteForm> = async ({ request }) => {
	const userAuth = (await protect(request.headers)) as JWTPayload;
	if (!userAuth) {
		throw new Error(`Error: unable to authenticate request`);
	}
	const { ids } = (await request.json()) as ContentDeleteForm;
	let id: ContentDocument['_id'] | undefined = undefined;
	if (Array.isArray(ids)) {
		ids.map((id) => castToObjectId(id));
	} else {
		id = castToObjectId(ids);
	}
	return Content.deleteById(id ? id : ids)
		.then(() => {
			return {
				status: 200
			};
		})
		.catch((err: any) => {
			console.error(err);
			return {
				//TODO: handle error and verify best status code for case
				status: 500
			};
		});
};
