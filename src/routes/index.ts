import { Content } from '$lib/_db/models/Content';
import type { CategoryDocument, ContentDocument, UserDocument } from '$lib/_db/mongoose.gen';
import type { RequestHandler } from '@sveltejs/kit';
import type { JSONContent } from '@tiptap/core';

export type SaveContentData = {
	state: 'draft' | 'published' | 'archived';
	authors: UserDocument['_id'][];
	title: string;
	content: {
		extended: JSONContent;
	};
	categories: CategoryDocument['_id'][];
	_id: ContentDocument['_id'];
};

export const post: RequestHandler = async (event) => {
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
