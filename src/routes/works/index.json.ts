import { getPubPaginatedContent, type PaginatedContentData } from '$lib/_db/controllers/content';
import { castToObjectId } from '$lib/_db/controllers/utils';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('pg');
	const cats = url.searchParams.getAll('cat').map((c) => castToObjectId(c));

	const contentData: PaginatedContentData =
		!page && !cats.length
			? await getPubPaginatedContent()
			: !page && cats.length
			? await getPubPaginatedContent(1, 10, { categories: cats })
			: page && !cats.length
			? await getPubPaginatedContent(Number(page))
			: await getPubPaginatedContent(Number(page), 10, { categories: cats });

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
