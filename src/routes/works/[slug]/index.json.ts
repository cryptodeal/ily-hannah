import { genHTML } from '$lib/functions/utils';
import { Content } from '$lib/_db/models/Content';
import type { RequestHandler } from '@sveltejs/kit';
type GetParams = Record<string, string> & {
	slug: string;
};
export const get: RequestHandler<GetParams> = async ({ params }) => {
	const { slug } = params;
	if (!slug) throw new Error('slug is required');
	const contentData = await Content.findBySlugWithAuthor(slug);
	const {
		title,
		state,
		content: { brief },
		author
	} = contentData;
	const content = genHTML(contentData.content.extended?.content);

	if (contentData) {
		return {
			body: {
				title,
				state,
				brief,
				author,
				content
			}
		};
	}

	return {
		// TODO: VERIFY THIS IS THE CORRECT STATUS CODE
		status: 400
	};
};
