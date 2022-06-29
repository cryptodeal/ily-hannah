import type { RequestHandler } from '@sveltejs/kit';
import { Content } from '$lib/_db/models/Content';
import { castToObjectId } from '$lib/_db/controllers/utils';
import type { ContentObject } from '$lib/_db/mongoose.gen';
import protect from '$lib/_auth/protect';
import type { JWTPayload, PublishContentData, SaveContentData } from '$lib/types';
import { getPaginatedContent, type ContentObjectSelect } from '$lib/_db/controllers/content';

type ContentDeleteForm = Record<string, string> & {
	ids: string[];
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

const isPublishContentData = (obj: unknown): obj is PublishContentData => {
	return obj !== null && typeof obj === 'object' && 'id' in obj;
};

export const post: RequestHandler = async (event) => {
	/* auth first; save work if not auth ;) */
	const userAuth = (await protect(event.request.headers)) as JWTPayload;
	if (!userAuth) {
		return {
			status: 401,
			body: {
				error: 'Must login to post to POST to /api/content'
			}
		};
	}

	const data: PublishContentData | SaveContentData = await event.request.json();
	if (isPublishContentData(data)) {
		const { id } = data;
		const res = await Content.publish(id.map((id) => castToObjectId(id)));
		if (res) {
			return {
				status: 200,
				body: {
					content: res
				}
			};
		} else {
			return {
				status: 503
			};
		}
	} else {
		const { title, authors, content, categories, state, _id } = data;
		const res = await Content.saveContent(title, authors, content, categories, state, _id);
		(res as unknown as ContentObjectSelect).checked = false;
		if (res) {
			return {
				status: 200,
				body: {
					content: res
				}
			};
		} else {
			return {
				status: 503
			};
		}
	}
};

export const del: RequestHandler<ContentDeleteForm> = async ({ request }) => {
	const userAuth = (await protect(request.headers)) as JWTPayload;
	if (!userAuth) {
		throw new Error(`Error: unable to authenticate request`);
	}
	const { ids } = (await request.json()) as ContentDeleteForm;

	return Content.deleteById(ids.map((id) => castToObjectId(id)))
		.then(() => {
			return {
				status: 200
			};
		})
		.catch((err: unknown) => {
			console.error(err);
			return {
				//TODO: handle error and verify best status code for case
				status: 500
			};
		});
};
