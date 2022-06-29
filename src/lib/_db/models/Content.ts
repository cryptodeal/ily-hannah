import mongoose from 'mongoose';
import { ContentJSON } from './ContentJSON';
import type {
	CategoryDocument,
	ContentDocument,
	ContentModel,
	ContentSchema,
	UserDocument
} from '../mongoose.gen';
import type { JSONContent } from '@tiptap/core';
import type { ContentObjectSelect } from '../controllers/content';

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
		extended: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentJSON' }
	},
	categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true, many: true }]
});

ContentSchema.statics = {
	deleteById(id: ContentDocument['_id'] | ContentDocument['_id'][]) {
		if (Array.isArray(id)) {
			return this.find({ _id: { $in: id } })
				.select('content.extended')
				.then((docs) => {
					if (!docs) return;
					const toDelete = docs
						.filter((d) => d.content?.extended)
						.map(({ content: { extended } }) => extended as mongoose.Types.ObjectId);
					return Promise.all([
						ContentJSON.deleteById(toDelete),
						this.deleteMany({ _id: { $in: id } }).exec()
					]);
				});
		} else {
			return this.findById(id)
				.select('content.extended')
				.then((doc) => {
					if (!doc) return;
					const toDelete = doc.content?.extended as mongoose.Types.ObjectId;
					return Promise.all([
						ContentJSON.deleteById(toDelete),
						this.deleteMany({ _id: { $in: id } }).exec()
					]);
				});
		}
	},
	addContent(
		title: string,
		authors: UserDocument['_id'][],
		content: { brief?: string; extended: JSONContent },
		categories: CategoryDocument['_id'][] = [],
		state: 'draft' | 'published' | 'archived' = 'draft'
	): Promise<ContentObjectSelect> {
		return ContentJSON.create(content.extended).then((contentJSON) => {
			const savedContent = {
				brief: content.brief,
				extended: contentJSON._id
			};
			return this.create({
				title,
				authors,
				categories,
				state,
				content: savedContent
			}).then((doc) => doc.toObject() as ContentObjectSelect);
		});
	},
	saveContent(
		title: string,
		authors: UserDocument['_id'][],
		content: { brief?: string; extended: JSONContent },
		categories: CategoryDocument['_id'][] = [],
		state: 'draft' | 'published' | 'archived' = 'draft',
		_id?: ContentDocument['_id']
	): Promise<ContentObjectSelect> {
		if (_id) {
			return this.findById(_id)
				.exec()
				.then((doc) => {
					if (!doc) throw new Error(`Error: Failed to find Content doc with id: ${_id.toString()}`);
					if (content.brief) doc.content.brief = content.brief;
					doc.title = title;
					doc.author.addToSet(...authors);
					doc.categories.addToSet(...categories);
					doc.state = state;
					return doc.save().then((doc: ContentDocument) => {
						if (!doc.content.extended)
							throw new Error(`Error: Document ${doc._id.toString()} has no extended content`);
						return ContentJSON.findByIdAndUpdate(doc.content.extended._id, content.extended)
							.exec()
							.then(() => doc.toObject() as ContentObjectSelect);
					});
				});
		} else {
			return this.addContent(title, authors, content, categories, state);
		}
	},

	publish(id: ContentDocument['_id'][]) {
		const update = { state: 'published' };
		const opts = { new: true };
		if (id.length > 1) {
			const filter = { _id: { $in: id } };
			return this.updateMany(filter, update)
				.exec()
				.then((res) => {
					if (!res.modifiedCount)
						throw new Error(`Error: Failed to publish batch; IDS:\n${id.join(',\n')}`);
					return this.find({ _id: { $in: id } })
						.exec()
						.then((docs) => docs.map((doc) => doc.toObject() as ContentObjectSelect));
				});
		} else {
			const filter = { _id: id };
			const update = { state: 'published' };
			return this.findOneAndUpdate(filter, update, opts)
				.exec()
				.then((doc) => {
					if (!doc) throw new Error(`Error: Failed to find Content doc with id: ${id.toString()}`);
					return doc.toObject() as ContentObjectSelect;
				});
		}
	}
};

ContentSchema.query = {
	paginateQuery(page = 0, limit = 25) {
		return this.limit(limit).skip(page * limit);
	},
	populateContent() {
		return this.populate('content.extended');
	}
};

export const Content: ContentModel = mongoose.model<ContentDocument, ContentModel>(
	'Content',
	ContentSchema
);
