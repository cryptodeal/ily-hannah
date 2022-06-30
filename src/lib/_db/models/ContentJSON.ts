import mongoose from 'mongoose';
import type { ContentJSONSchema, ContentJSONModel, ContentJSONDocument } from '../mongoose.gen';

const ContentJSONSchema: ContentJSONSchema = new mongoose.Schema({
	content: { type: mongoose.Schema.Types.Mixed }
});

ContentJSONSchema.statics = {
	deleteById(id: ContentJSONDocument['_id'] | ContentJSONDocument['_id'][]) {
		return this.deleteMany({ _id: { $in: Array.isArray(id) ? id : [id] } }).exec();
	}
};
export const ContentJSON: ContentJSONModel = mongoose.model<ContentJSONDocument, ContentJSONModel>(
	'ContentJSON',
	ContentJSONSchema
);
