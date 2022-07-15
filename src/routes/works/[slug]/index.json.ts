/* eslint-disable @typescript-eslint/no-explicit-any */
import { genHTML } from '$lib/functions/utils';
import { Content } from '$lib/_db/models/Content';
import type { RequestHandler } from '@sveltejs/kit';
type GetParams = Record<string, string> & {
	slug: string;
};
export const GET: RequestHandler<GetParams> = async ({ params }) => {
	const { slug } = params;
	if (!slug) throw new Error('slug is required');
	const contentData = await Content.findBySlugWithAuthor(slug);
	const {
		title,
		state,
		content: { brief },
		author
	} = contentData;
	/* programatically remove title from doc for rendering */
	let titleAlign = 'left';
	if (contentData.content.extended?.content?.content) {
		const { content } = contentData.content.extended.content;
		if (content.findIndex((x: any) => x.attrs?.level === 1 && x.type === 'heading') === 0) {
			const [{ attrs }] = content.splice(0, 1);
			if (attrs?.textAlign) {
				titleAlign = attrs.textAlign;
			}
		}
	}

	const content = genHTML(contentData.content.extended?.content);

	if (contentData) {
		return {
			body: {
				title,
				titleAlign,
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
