import { findUserById, updateUserData } from '$lib/_db/controllers/user';
import protect from '$lib/_auth/protect';
// import { validateUserForm } from '$lib/functions/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserFormData, JWTPayload } from '$lib/types';
import { getPaginatedContent } from '$lib/_db/controllers/content';
import type { ContentObject } from '$lib/_db/mongoose.gen';

export const get: RequestHandler = async ({ url }) => {
	const userId = url.searchParams.get('userId');

	if (!userId) {
		const page = url.searchParams.get('pg');
		if (!page) throw new Error('page is required');

		const contentData = await getPaginatedContent(Number(page));

		if (contentData) {
			return {
				body: {
					contentData: contentData as unknown as ContentObject[]
				}
			};
		}

		return {
			status: 500
		};
	} else {
		const userData = await findUserById(userId);
		/* TODO: only load posts author has access too */
		const contentData = await getPaginatedContent();

		if (userData && contentData) {
			return {
				body: {
					userData,
					contentData: contentData as unknown as ContentObject[]
				}
			};
		}

		return {
			status: 500
		};
	}
};

export type ProfilePostType = 'Add' | 'Update';

export const post: RequestHandler = async (event) => {
	const data = (await event.request.json()) as UserFormData;
	const userAuth = (await protect(event.request.headers)) as JWTPayload;
	if (!userAuth) {
		throw new Error(`Error: unable to authenticate request`);
	}

	const user = await updateUserData(userAuth.id, data);
	if (user) {
		return {
			status: 200
		};
	}

	return {
		status: 503
	};
};
