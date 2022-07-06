import { Content } from '$lib/_db/models/Content';
import type { RequestHandler } from '@sveltejs/kit';
type GetParams = Record<string, string> & {
	slug: string;
};
export const get: RequestHandler<GetParams> = async ({ params }) => {
	const { slug } = params;
	if (!slug) throw new Error('slug is required');
	const contentData = await Content.findBySlug(slug);

	/* programmatically add title if not in doc */
	if (contentData.content.extended?.content?.content) {
		const { content } = contentData.content.extended.content;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (!content.filter((x: any) => x.attrs.level === 1 && x.type === 'heading').length) {
			console.log(true);
			content.unshift({
				type: 'heading',
				attrs: { textAlign: 'left', level: 1 },
				content: [{ type: 'text', text: contentData.title }]
			});
		}
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
