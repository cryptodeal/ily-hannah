import { Content } from '$lib/_db/models/Content';
import { set_attributes } from 'svelte/internal';
import type {
	UserDocument,
	ContentObject,
	ContentDocument,
	CategoryDocument,
	PopulatedDocument
} from '../mongoose.gen';

export type ContentObjectSelect = ContentObject & {
	checked: boolean;
};

export type PaginatedContentPub = {
	itemList: PopulatedDocument<PopulatedDocument<ContentDocument, 'content.extended'>, 'author'>[];
	itemCount: number;
	perPage: number;
	currentPage: number;
	pageCount: number;
	next: number | undefined;
	prev: number | undefined;
	hasNextPage: boolean;
	hasPrevPage: boolean;
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
			.select('title content state slug author')
			.populateContent()
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
			next: page + 1 <= pageCount ? page + 1 : undefined,
			prev: page - 1 >= 1 ? page - 1 : undefined,
			hasNextPage: page < pageCount,
			hasPrevPage: page - 1 > 0
		};
	});
};

export const getPubPaginatedContent = (
	page = 1,
	limit = 10,
	query: {
		author?: UserDocument['_id'][] | UserDocument['_id'];
		state?: ContentDocument['state'];
		categories?: CategoryDocument['_id'][] | CategoryDocument['_id'];
	} = {}
): Promise<PaginatedContentData> => {
	let { state } = query;
	const { author, categories } = query;
	if (!state) state = 'published';
	const queryObj = Object.assign({}, { state });
	if (author)
		Object.assign(queryObj, { author: { $in: Array.isArray(author) ? author : [author] } });
	if (categories)
		Object.assign(queryObj, {
			categories: { $elemMatch: { $in: Array.isArray(categories) ? categories : [categories] } }
		});
	return Promise.all([
		Content.find(queryObj)
			.select('-_id title slug author publishedDate')
			.sort('publishedDate')
			.paginateQuery(page - 1, limit)
			.populate('author', 'name.first name.last')
			.lean()
			.exec(),
		Content.countDocuments(queryObj).exec()
	]).then((res: [ContentObject[], number]) => {
		const pageCount = Math.ceil(res[1] / limit);
		return {
			itemList: res[0] as ContentObjectSelect[],
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
