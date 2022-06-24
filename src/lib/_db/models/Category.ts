import mongoose from 'mongoose';
import type { CategoryDocument, CategoryModel, CategorySchema } from '../mongoose.gen';

const CategorySchema: CategorySchema = new mongoose.Schema({
	name: { type: String, unique: true, index: true }
});

export const Category: CategoryModel =
	(mongoose.models.Category as CategoryModel) ||
	mongoose.model<CategoryDocument, CategoryModel>('Category', CategorySchema);
