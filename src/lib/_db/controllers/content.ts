import { Content } from '$lib/_db/models/Content';

export const getContentList = () => {
	return Content.find().select('title content.extended').lean();
};
