import { Content } from '$lib/_db/models/Content';
import type { RequestHandler } from '@sveltejs/kit';
type GetParams = Record<string, string> & {
	slug: string;
};
export const get: RequestHandler<GetParams> = async ({ params }) => {
	const { slug } = params;
	if (!slug) throw new Error('slug is required');
	const contentData = await Content.findBySlug(slug);
	if (
		!contentData.content.extended?.content?.content.filter(
			(x: any) => x.attrs?.level === 1 && x.type === 'heading'
		)
	) {
		console.log(true);
		contentData.content.extended?.content?.content.unshift({
			type: 'heading',
			attrs: { textAlign: 'left', level: 1 },
			content: [{ type: 'text', text: contentData.title }]
		});
	}

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
