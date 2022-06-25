import { User } from '$lib/_db/models/User';
import Email from '$lib/_auth/email';
import type UAParser from 'ua-parser-js';

const sendAuthLink = async (
	email: string,
	ua: UAParser.IResult,
	time: string,
	host: string
): Promise<boolean> => {
	// Get user from body.email
	let user = await User.findOne({ email: email });

	if (!user) {
		user = await User.create({
			email: email
		});
	}

	// Generate random auth token
	const authToken = user.createAuthToken();
	await user.save({ validateBeforeSave: false });

	const authLink = `http://${host}/api/auth/verify/${authToken}`;
	if (!ua.browser.name) throw Error('Error: ua.browser.name is undefined');
	if (!ua.os.name) throw Error('Error: ua.os.name is undefined');

	try {
		await new Email(user, authLink, ua.browser.name, ua.os.name, time).sendMagicLink();
		return true;
	} catch (err) {
		user.authLoginToken = undefined;
		user.authLoginExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return false;
	}
};

export default sendAuthLink;
