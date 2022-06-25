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
