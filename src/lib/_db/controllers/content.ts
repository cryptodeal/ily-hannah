import { Content } from '$lib/_db/models/Content';
import type { UserDocument, ContentObject } from '../mongoose.gen';
export type ContentObjectSelect = ContentObject & {
	checked: boolean;
};

export type PaginatedContentData = {
	itemList: ContentObjectSelect[];
	itemCount: number;
	perPage: number;
	currentPage: number;
	pageCount: number;
	next: number | undefined;
	prev: number | undefined;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

export const getPaginatedContent = (
	page = 1,
	limit = 25,
	author?: UserDocument['_id']
): Promise<PaginatedContentData> => {
	return Promise.all([
		Content.find(!author ? {} : { author })
			.sort('title')
			.paginateQuery(page - 1, limit)
			.select('title content')
			.lean()
			.exec(),
		Content.countDocuments(!author ? {} : { author }).exec()
	]).then((res: [ContentObject[], number]) => {
		const pageCount = Math.ceil(res[1] / limit);
		return {
			itemList: res[0] as ContentObjectSelect[],
			itemCount: res[1],
			perPage: limit,
			currentPage: page,
			pageCount,
			next: page <= pageCount ? page : undefined,
			prev: page - 1 >= 1 ? page - 1 : undefined,
			hasNextPage: page < pageCount,
			hasPrevPage: page - 1 > 1
		};
	});
};
