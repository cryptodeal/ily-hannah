import { getPubPaginatedContent } from '$lib/_db/controllers/content';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('pg') || 1;
	const contentData = await getPubPaginatedContent(Number(page));
	contentData.itemList.map((i) => {
		i.checked = false;
		return i;
	});
	if (contentData) {
		return {
			body: {
				contentData
			}
		};
	}
	return {
		status: 500
	};
};
