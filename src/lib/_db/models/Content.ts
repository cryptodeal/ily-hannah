import mongoose from 'mongoose';
import { wrap, plugin, SluggerOptions } from 'mongoose-slugger-plugin';
import { ContentJSON } from './ContentJSON';
import type {
	CategoryDocument,
	ContentDocument,
	ContentModel,
	ContentSchema,
	PopulatedDocument,
	UserDocument
} from '../mongoose.gen';
import type { JSONContent } from '@tiptap/core';
import type { ContentObjectSelect } from '../controllers/content';

const ContentSchema: ContentSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true, index: true },
	slug: { type: String, required: true },
	state: {
		type: String,
		enum: ['draft', 'published', 'archived'],
		default: 'draft',
		required: true,
		index: true
	},
	content: {
		brief: { type: String },
		extended: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentJSON' }
	},
	author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, many: true }],
	publishedDate: { type: Date, index: true },
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
		author: UserDocument['_id'][],
		content: { brief?: string; extended: JSONContent },
		categories: CategoryDocument['_id'][] = [],
		state: 'draft' | 'published' | 'archived' = 'draft'
	): Promise<ContentObjectSelect> {
		return ContentJSON.create({ content: content.extended }).then((contentJSON) => {
			const savedContent = {
				brief: content.brief,
				extended: contentJSON._id
			};
			return this.create({
				title,
				author,
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
						return ContentJSON.findByIdAndUpdate(doc.content.extended._id, {
							content: content.extended
						})
							.exec()
							.then(() => doc.toObject() as ContentObjectSelect);
					});
				});
		} else {
			return this.addContent(title, authors, content, categories, state);
		}
	},

	updateState(
		id: ContentDocument['_id'][],
		state: 'draft' | 'published' | 'archived' = 'published'
	) {
		const update = { state };
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
			const update = { state };
			return this.findOneAndUpdate(filter, update, opts)
				.exec()
				.then((doc) => {
					if (!doc) throw new Error(`Error: Failed to find Content doc with id: ${id.toString()}`);
					return doc.toObject() as ContentObjectSelect;
				});
		}
	},

	findBySlug(slug: string): Promise<PopulatedDocument<ContentDocument, 'content.extended'>> {
		return this.findOne({ slug })
			.populate('content.extended')
			.exec()
			.then((doc) => {
				if (!doc) throw new Error(`Error: Failed to find Content doc with slug: ${slug}`);
				return doc;
			});
	},

	findBySlugWithAuthor(
		slug: string
	): Promise<PopulatedDocument<PopulatedDocument<ContentDocument, 'content.extended'>, 'author'>> {
		return this.findOne({ slug })
			.populate('content.extended')
			.populate('author', 'name')
			.select('author content title')
			.lean()
			.exec()
			.then((doc) => {
				if (!doc) throw new Error(`Error: Failed to find Content doc with slug: ${slug}`);
				return doc as PopulatedDocument<
					PopulatedDocument<ContentDocument, 'content.extended'>,
					'author'
				>;
			});
	}
};

ContentSchema.query = {
	paginateQuery(page = 0, limit = 25) {
		return this.limit(limit).skip(page * limit);
	},
	populateCats() {
		return this.populate('categories', 'name');
	},
	populateContent() {
		return this.populate('content.extended');
	}
};

ContentSchema.index({ slug: 1 }, { name: 'slug', unique: true });

ContentSchema.plugin(
	plugin,
	new SluggerOptions({
		slugPath: 'slug',
		generateFrom: ['title'],
		index: 'slug'
	})
);

export const Content: ContentModel = wrap(
	mongoose.model<ContentDocument, ContentModel>('Content', ContentSchema)
);
