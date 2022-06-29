/* tslint:disable */
/* eslint-disable */

// ######################################## THIS FILE WAS GENERATED BY MONGOOSE-TSGEN ######################################## //

// NOTE: ANY CHANGES MADE WILL BE OVERWRITTEN ON SUBSEQUENT EXECUTIONS OF MONGOOSE-TSGEN.

import mongoose from 'mongoose';
import type { JSONContent } from '@tiptap/core';
import type { ContentObjectSelect } from './controllers/content';

/**
 * Lean version of CategoryDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CategoryDocument.toObject()`. To avoid conflicts with model names, use the type alias `CategoryObject`.
 * ```
 * const categoryObject = category.toObject();
 * ```
 */
export type Category = {
	name?: string;
	_id: mongoose.Types.ObjectId;
};

/**
 * Lean version of CategoryDocument (type alias of `Category`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Category } from "../models"
 * import { CategoryObject } from "../interfaces/mongoose.gen.ts"
 *
 * const categoryObject: CategoryObject = category.toObject();
 * ```
 */
export type CategoryObject = Category;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type CategoryQuery = mongoose.Query<any, CategoryDocument, CategoryQueries> &
	CategoryQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `CategorySchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type CategoryQueries = {};

export type CategoryMethods = {};

export type CategoryStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Category = mongoose.model<CategoryDocument, CategoryModel>("Category", CategorySchema);
 * ```
 */
export type CategoryModel = mongoose.Model<CategoryDocument, CategoryQueries> & CategoryStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Category schema instances:
 * ```
 * const CategorySchema: CategorySchema = new mongoose.Schema({ ... })
 * ```
 */
export type CategorySchema = mongoose.Schema<
	CategoryDocument,
	CategoryModel,
	CategoryMethods,
	CategoryQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Category = mongoose.model<CategoryDocument, CategoryModel>("Category", CategorySchema);
 * ```
 */
export type CategoryDocument = mongoose.Document<mongoose.Types.ObjectId, CategoryQueries> &
	CategoryMethods & {
		name?: string;
		_id: mongoose.Types.ObjectId;
	};

/**
 * Lean version of ContentDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `ContentDocument.toObject()`. To avoid conflicts with model names, use the type alias `ContentObject`.
 * ```
 * const contentObject = content.toObject();
 * ```
 */
export type Content = {
	title: string;
	state: 'draft' | 'published' | 'archived';
	author: (User['_id'] | User)[];
	publishedDate?: Date;
	content: {
		brief?: string;
		extended?: ContentJSON['_id'] | ContentJSON;
	};
	categories: (Category['_id'] | Category)[];
	_id: mongoose.Types.ObjectId;
};

/**
 * Lean version of ContentDocument (type alias of `Content`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Content } from "../models"
 * import { ContentObject } from "../interfaces/mongoose.gen.ts"
 *
 * const contentObject: ContentObject = content.toObject();
 * ```
 */
export type ContentObject = Content;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type ContentQuery = mongoose.Query<any, ContentDocument, ContentQueries> & ContentQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `ContentSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type ContentQueries = {
	paginateQuery: (this: ContentQuery, page?: number, limit?: number) => ContentQuery;
	populateContent: (this: ContentQuery) => ContentQuery;
};

export type ContentMethods = {};

export type ContentStatics = {
	deleteById: (this: ContentModel, id: ContentDocument['_id'] | ContentDocument['_id'][]) => any;
	addContent: (
		this: ContentModel,
		title: string,
		authors: UserDocument['_id'][],
		content: { brief?: string; extended: JSONContent },
		categories?: CategoryDocument['_id'][],
		state?: 'draft' | 'published' | 'archived'
	) => Promise<ContentObjectSelect>;
	saveContent: (
		this: ContentModel,
		title: string,
		authors: UserDocument['_id'][],
		content: { brief?: string; extended: JSONContent },
		categories?: CategoryDocument['_id'][],
		state?: 'draft' | 'published' | 'archived',
		_id?: ContentDocument['_id']
	) => Promise<ContentObjectSelect>;
	publish: (this: ContentModel, id: ContentDocument['_id'][]) => any;
};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Content = mongoose.model<ContentDocument, ContentModel>("Content", ContentSchema);
 * ```
 */
export type ContentModel = mongoose.Model<ContentDocument, ContentQueries> & ContentStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Content schema instances:
 * ```
 * const ContentSchema: ContentSchema = new mongoose.Schema({ ... })
 * ```
 */
export type ContentSchema = mongoose.Schema<
	ContentDocument,
	ContentModel,
	ContentMethods,
	ContentQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Content = mongoose.model<ContentDocument, ContentModel>("Content", ContentSchema);
 * ```
 */
export type ContentDocument = mongoose.Document<mongoose.Types.ObjectId, ContentQueries> &
	ContentMethods & {
		title: string;
		state: 'draft' | 'published' | 'archived';
		author: mongoose.Types.Array<UserDocument['_id'] | UserDocument>;
		publishedDate?: Date;
		content: {
			brief?: string;
			extended?: ContentJSONDocument['_id'] | ContentJSONDocument;
		};
		categories: mongoose.Types.Array<CategoryDocument['_id'] | CategoryDocument>;
		_id: mongoose.Types.ObjectId;
	};

/**
 * Lean version of ContentJSONDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `ContentJSONDocument.toObject()`. To avoid conflicts with model names, use the type alias `ContentJSONObject`.
 * ```
 * const contentjsonObject = contentjson.toObject();
 * ```
 */
export type ContentJSON = {
	_id: mongoose.Types.ObjectId;
};

/**
 * Lean version of ContentJSONDocument (type alias of `ContentJSON`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { ContentJSON } from "../models"
 * import { ContentJSONObject } from "../interfaces/mongoose.gen.ts"
 *
 * const contentjsonObject: ContentJSONObject = contentjson.toObject();
 * ```
 */
export type ContentJSONObject = ContentJSON;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type ContentJSONQuery = mongoose.Query<any, ContentJSONDocument, ContentJSONQueries> &
	ContentJSONQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `ContentJSONSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type ContentJSONQueries = {};

export type ContentJSONMethods = {};

export type ContentJSONStatics = {
	deleteById: (
		this: ContentJSONModel,
		id: ContentJSONDocument['_id'] | ContentJSONDocument['_id'][]
	) => any;
};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const ContentJSON = mongoose.model<ContentJSONDocument, ContentJSONModel>("ContentJSON", ContentJSONSchema);
 * ```
 */
export type ContentJSONModel = mongoose.Model<ContentJSONDocument, ContentJSONQueries> &
	ContentJSONStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new ContentJSON schema instances:
 * ```
 * const ContentJSONSchema: ContentJSONSchema = new mongoose.Schema({ ... })
 * ```
 */
export type ContentJSONSchema = mongoose.Schema<
	ContentJSONDocument,
	ContentJSONModel,
	ContentJSONMethods,
	ContentJSONQueries
>;

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const ContentJSON = mongoose.model<ContentJSONDocument, ContentJSONModel>("ContentJSON", ContentJSONSchema);
 * ```
 */
export type ContentJSONDocument = mongoose.Document<mongoose.Types.ObjectId, ContentJSONQueries> &
	ContentJSONMethods & {
		_id: mongoose.Types.ObjectId;
	};

/**
 * Lean version of UserRefreshTokenDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type UserRefreshToken = {
	token?: string;
	expiration?: Date;
	issued?: Date;
	_id: mongoose.Types.ObjectId;
};

/**
 * Lean version of UserDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`. To avoid conflicts with model names, use the type alias `UserObject`.
 * ```
 * const userObject = user.toObject();
 * ```
 */
export type User = {
	email: string;
	authLoginToken?: string;
	authLoginExpires?: Date;
	refreshTokens: UserRefreshToken[];
	active?: boolean;
	username?: string;
	scope: string;
	premiumUser: {
		isPaid?: boolean;
		subscriptionDate?: Date;
		subscriptionEnd?: Date;
	};
	bio?: any;
	name: {
		first?: string;
		last?: string;
	};
	birthdate?: Date;
	image?: string;
	_id: mongoose.Types.ObjectId;
	updatedAt?: Date;
	createdAt?: Date;
};

/**
 * Lean version of UserDocument (type alias of `User`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { User } from "../models"
 * import { UserObject } from "../interfaces/mongoose.gen.ts"
 *
 * const userObject: UserObject = user.toObject();
 * ```
 */
export type UserObject = User;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type UserQuery = mongoose.Query<any, UserDocument, UserQueries> & UserQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `UserSchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type UserQueries = {};

export type UserMethods = {
	createAuthToken: (this: UserDocument) => any;
};

export type UserStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserModel = mongoose.Model<UserDocument, UserQueries> & UserStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new User schema instances:
 * ```
 * const UserSchema: UserSchema = new mongoose.Schema({ ... })
 * ```
 */
export type UserSchema = mongoose.Schema<UserDocument, UserModel, UserMethods, UserQueries>;

/**
 * Mongoose Subdocument type
 *
 * Type of `UserDocument["refreshTokens"]` element.
 */
export type UserRefreshTokenDocument = mongoose.Types.Subdocument & {
	token?: string;
	expiration?: Date;
	issued?: Date;
	_id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
 * ```
 */
export type UserDocument = mongoose.Document<mongoose.Types.ObjectId, UserQueries> &
	UserMethods & {
		email: string;
		authLoginToken?: string;
		authLoginExpires?: Date;
		refreshTokens: mongoose.Types.DocumentArray<UserRefreshTokenDocument>;
		active?: boolean;
		username?: string;
		scope: string;
		premiumUser: {
			isPaid?: boolean;
			subscriptionDate?: Date;
			subscriptionEnd?: Date;
		};
		bio?: any;
		name: {
			first?: string;
			last?: string;
		};
		birthdate?: Date;
		image?: string;
		_id: mongoose.Types.ObjectId;
		updatedAt?: Date;
		createdAt?: Date;
	};

/**
 * Check if a property on a document is populated:
 * ```
 * import { IsPopulated } from "../interfaces/mongoose.gen.ts"
 *
 * if (IsPopulated<UserDocument["bestFriend"]>) { ... }
 * ```
 */
export function IsPopulated<T>(doc: T | mongoose.Types.ObjectId): doc is T {
	return doc instanceof mongoose.Document;
}

/**
 * Helper type used by `PopulatedDocument`. Returns the parent property of a string
 * representing a nested property (i.e. `friend.user` -> `friend`)
 */
type ParentProperty<T> = T extends `${infer P}.${string}` ? P : never;

/**
 * Helper type used by `PopulatedDocument`. Returns the child property of a string
 * representing a nested property (i.e. `friend.user` -> `user`).
 */
type ChildProperty<T> = T extends `${string}.${infer C}` ? C : never;

/**
 * Helper type used by `PopulatedDocument`. Removes the `ObjectId` from the general union type generated
 * for ref documents (i.e. `mongoose.Types.ObjectId | UserDocument` -> `UserDocument`)
 */
type PopulatedProperty<Root, T extends keyof Root> = Omit<Root, T> & {
	[ref in T]: Root[T] extends mongoose.Types.Array<infer U>
		? mongoose.Types.Array<Exclude<U, mongoose.Types.ObjectId>>
		: Exclude<Root[T], mongoose.Types.ObjectId>;
};

/**
 * Populate properties on a document type:
 * ```
 * import { PopulatedDocument } from "../interfaces/mongoose.gen.ts"
 *
 * function example(user: PopulatedDocument<UserDocument, "bestFriend">) {
 *   console.log(user.bestFriend._id) // typescript knows this is populated
 * }
 * ```
 */
export type PopulatedDocument<DocType, T> = T extends keyof DocType
	? PopulatedProperty<DocType, T>
	: ParentProperty<T> extends keyof DocType
	? Omit<DocType, ParentProperty<T>> & {
			[ref in ParentProperty<T>]: DocType[ParentProperty<T>] extends mongoose.Types.Array<infer U>
				? mongoose.Types.Array<
						ChildProperty<T> extends keyof U
							? PopulatedProperty<U, ChildProperty<T>>
							: PopulatedDocument<U, ChildProperty<T>>
				  >
				: ChildProperty<T> extends keyof DocType[ParentProperty<T>]
				? PopulatedProperty<DocType[ParentProperty<T>], ChildProperty<T>>
				: PopulatedDocument<DocType[ParentProperty<T>], ChildProperty<T>>;
	  }
	: DocType;

/**
 * Helper types used by the populate overloads
 */
type Unarray<T> = T extends Array<infer U> ? U : T;
type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Augment mongoose with Query.populate overloads
 */
declare module 'mongoose' {
	interface Query<ResultType, DocType, THelpers = {}> {
		populate<T extends string>(
			path: T,
			select?: string | any,
			model?: string | Model<any, THelpers>,
			match?: any
		): Query<
			ResultType extends Array<DocType>
				? Array<PopulatedDocument<Unarray<ResultType>, T>>
				: ResultType extends DocType
				? PopulatedDocument<Unarray<ResultType>, T>
				: ResultType,
			DocType,
			THelpers
		> &
			THelpers;

		populate<T extends string>(
			options: Modify<PopulateOptions, { path: T }> | Array<PopulateOptions>
		): Query<
			ResultType extends Array<DocType>
				? Array<PopulatedDocument<Unarray<ResultType>, T>>
				: ResultType extends DocType
				? PopulatedDocument<Unarray<ResultType>, T>
				: ResultType,
			DocType,
			THelpers
		> &
			THelpers;
	}
}
