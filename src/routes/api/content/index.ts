import type { RequestHandler } from '@sveltejs/kit';
import { Content } from '$lib/_db/models/Content';
import { castToObjectId } from '$lib/_db/controllers/utils';
import type { ContentDocument } from '$lib/_db/mongoose.gen';
import protect from '$lib/_auth/protect';
import type { JWTPayload } from '$lib/types';

type ContentDeleteForm = Record<string, string> & {
	ids: string[] | string;
};

export const del: RequestHandler<ContentDeleteForm> = async ({ request }) => {
	const userAuth = (await protect(request.headers)) as JWTPayload;
	if (!userAuth) {
		throw new Error(`Error: unable to authenticate request`);
	}
	const { ids } = (await request.json()) as ContentDeleteForm;
	let id: ContentDocument['_id'] | undefined = undefined;
	if (Array.isArray(ids)) {
		ids.map((id) => castToObjectId(id));
	} else {
		id = castToObjectId(ids);
	}
	return Content.deleteById(id ? id : ids)
		.then(() => {
			return {
				status: 200
			};
		})
		.catch((err: any) => {
			console.error(err);
			return {
				//TODO: handle error and verify best status code for case
				status: 500
			};
		});
};
