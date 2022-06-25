import mongoose from 'mongoose';
import type {
	CategoryDocument,
	ContentDocument,
	ContentModel,
	ContentSchema,
	UserDocument
} from '../mongoose.gen';
import type { JSONContent } from '@tiptap/core';

const ContentSchema: ContentSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true, index: true },
	state: {
		type: String,
		enum: ['draft', 'published', 'archived'],
		default: 'draft',
		required: true,
		index: true
	},
	author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, many: true }],
	publishedDate: { type: Date, index: true },
	content: {
		brief: { type: String },
		extended: { type: Object }
	},
	categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true, many: true }]
});

ContentSchema.statics = {
	saveContent(
		title: string,
		authors: UserDocument['_id'][],
		content: { brief?: string; extended: JSONContent },
		categories: CategoryDocument['_id'][] = [],
		state: 'draft' | 'published' | 'archived' = 'draft',
		_id?: ContentDocument['_id']
	) {
		if (_id) {
			return this.findOneAndUpdate(
				{ _id },
				{
					title,
					state,
					author: authors,
					content,
					publishedDate: state === 'published' ? new Date() : undefined,
					categories
				}
			).exec();
		} else {
			return new this({
				title,
				state,
				author: authors,
				content,
				publishedDate: state === 'published' ? new Date() : undefined,
				categories
			}).save();
		}
	}
};

ContentSchema.query = {
	paginateQuery(page = 0, limit = 25) {
		return this.limit(limit).skip(page * limit);
	}
};

export const Content: ContentModel =
	(mongoose.models.Content as ContentModel) ||
	mongoose.model<ContentDocument, ContentModel>('Content', ContentSchema);
