export interface NewUserFormData {
	userId: Types.ObjectId;
	name: {
		first: string;
		last: string;
	};
	birthdate: Date;
	teamSubs: string[];
}
export interface PostAuthBody {
	email: string;
}

export interface CreatedToken {
	accessToken: string;
	refreshToken: string;
	tokenPayload: string;
}

export interface JWTPayload {
	email: string;
	scope: string;
	id: string;
	iat: number;
	exp: number;
}

export interface UserFormData {
	consentTandC?: boolean;
	userId: Types.ObjectId;
	name?: {
		first?: string;
		last?: string;
	};
	//birthdate: Date;
}

export type PublishContentData = {
	id: string[];
	state: 'draft' | 'published' | 'archived';
};

export type SaveContentData = {
	state: 'draft' | 'published' | 'archived';
	authors: UserDocument['_id'][];
	title: string;
	content: {
		extended: JSONContent;
	};
	categories: CategoryDocument['_id'][];
	_id: ContentDocument['_id'];
};

export type APICatPOST = {
	id?: string;
	name: string;
	type: number;
};
