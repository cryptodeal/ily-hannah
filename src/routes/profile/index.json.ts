import { findUserById, addNewUserFormData, updateUserData } from '$lib/_db/controllers/user';
import protect from '$lib/_auth/protect';
// import { validateUserForm } from '$lib/functions/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import type { NewUserFormData, JWTPayload } from '$lib/types';

export const get: RequestHandler = async ({ url }) => {
	const userId = url.searchParams.get('userId');
	if (!userId) throw Error('userId is required');

	const userData = await findUserById(userId);

	if (userData) {
		return {
			body: {
				userData
			}
		};
	}

	return {
		status: 500
	};
};

export type ProfilePostType = 'Add' | 'Update';

export const post: RequestHandler = async (event) => {
	const data = (await event.request.json()) as NewUserFormData;
	console.log(data);
	return {
		status: 503
	};
};
