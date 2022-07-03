import { getPubPaginatedContent, type PaginatedContentData } from '$lib/_db/controllers/content';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('pg');
	let contentData: PaginatedContentData;
	if (!page) {
		contentData = await getPubPaginatedContent();
	} else {
		contentData = await getPubPaginatedContent(Number(page));
	}
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
