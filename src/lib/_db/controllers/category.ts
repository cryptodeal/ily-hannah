import { Category } from '$lib/_db/models/Category';
import type { CategoryObject } from '$lib/_db/mongoose.gen';

export type CategoryObjectSelect = CategoryObject & {
	checked: boolean;
};

export type PaginatedCatData = {
	itemList: CategoryObjectSelect[];
	itemCount: number;
	perPage: number;
	currentPage: number;
	pageCount: number;
	next: number | undefined;
	prev: number | undefined;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

export const getPaginatedCats = (page = 1, limit = 25): Promise<PaginatedCatData> => {
	return Promise.all([
		Category.find()
			.sort('name')
			.paginateQuery(page - 1, limit)
			.lean()
			.exec(),
		Category.countDocuments().exec()
	]).then((res: [CategoryObject[], number]) => {
		const pageCount = Math.ceil(res[1] / limit);
		return {
			itemList: res[0] as CategoryObjectSelect[],
			itemCount: res[1],
			perPage: limit,
			currentPage: page,
			pageCount,
			next: page + 1 <= pageCount ? page + 1 : undefined,
			prev: page - 1 >= 1 ? page - 1 : undefined,
			hasNextPage: page < pageCount,
			hasPrevPage: page - 1 > 0
		};
	});
};
