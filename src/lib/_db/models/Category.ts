import mongoose from 'mongoose';
import type {
	CategoryDocument,
	CategoryModel,
	CategoryObject,
	CategorySchema
} from '../mongoose.gen';

const CategorySchema: CategorySchema = new mongoose.Schema({
	name: { type: String, unique: true, required: true, index: true }
});

CategorySchema.statics = {
	getCatList() {
		return this.find()
			.sort({ name: 1 })
			.lean()
			.exec()
			.then((cats: CategoryObject[] | null) => {
				if (!cats) throw new Error('No categories found');
				return cats;
			});
	},
	addOrUpdateCat(name: string, id?: CategoryDocument['_id']) {
		if (id) {
			return this.findOneAndUpdate({ id }, { name }, { new: true }).exec();
		} else {
			return this.create({ name });
		}
	},
	addCat(name: string) {
		return this.create({ name });
	}
};

CategorySchema.query = {
	paginateQuery(page = 0, limit = 25) {
		return this.limit(limit).skip(page * limit);
	}
};

export const Category: CategoryModel = mongoose.model<CategoryDocument, CategoryModel>(
	'Category',
	CategorySchema
);
