import { findUserById, updateUserData } from '$lib/_db/controllers/user';
import protect from '$lib/_auth/protect';
// import { validateUserForm } from '$lib/functions/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserFormData, JWTPayload } from '$lib/types';
import { getPaginatedContent } from '$lib/_db/controllers/content';
import type { ContentObject } from '$lib/_db/mongoose.gen';
import { castToObjectId } from '$lib/_db/controllers/utils';

export const GET: RequestHandler = async ({ url, locals }) => {
	const userId = url.searchParams.get('userId');

	if (!userId) {
		const page = url.searchParams.get('pg');
		if (!page) throw new Error('page is required');
		const _id = locals.user?.id ? castToObjectId(locals.user?.id) : undefined;
		const contentData = await getPaginatedContent(Number(page), 25, _id);
		contentData.itemList.map((i) => {
			i.checked = false;
			return i;
		});

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
		const contentData = await getPaginatedContent(1, 25, userData?._id);
		contentData.itemList.map((i) => {
			i.checked = false;
			return i;
		});

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

export enum ProfilePost {
	ADD,
	UPDATE
}

export const POST: RequestHandler = async (event) => {
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
