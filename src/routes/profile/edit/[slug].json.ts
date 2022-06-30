import { Content } from '$lib/_db/models/Content';
import type { RequestHandler } from '@sveltejs/kit';
type GetParams = Record<string, string> & {
	slug: string;
};
export const get: RequestHandler<GetParams> = async ({ params }) => {
	const { slug } = params;
	if (!slug) throw new Error('slug is required');
	const contentData = await Content.findBySlug(slug);

	if (contentData) {
		return {
			body: {
				contentData
			}
		};
	}

	return {
		// TODO: VERIFY THIS IS THE CORRECT STATUS CODE
		status: 400
	};
};
