import { User } from '$lib/_db/models/User';
import signToken from '$lib/_auth/signToken';
import cookie from 'cookie';
import crypto from 'crypto';

const refreshAuth = async (cookies: { [key: string]: string }): Promise<string | undefined> => {
	const env = import.meta.env.VITE_NODE_ENV;
	if (!env || (env !== 'development' && env !== 'production') || typeof env !== 'string') {
		throw Error(`Error: invalid setting for VITE_NODE_ENV: ${env}`);
	}
	const { refreshToken } = cookies;

	// Get user based on hashed refresh token
	const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

	// Check if user exists with refresh token
	const refreshUser = await User.findOne({
		'refreshTokens.expiration': { $gt: Date.now() },
		'refreshTokens.token': hashedRefreshToken
	});
	if (!refreshUser) {
		console.log(`Error: could not find user with refreshTokens.token match`);
		return;
	}

	// Create new token
	const refreshAuthToken = signToken(refreshUser);

	const accessToken = cookie.serialize('accessToken', refreshAuthToken, {
		httpOnly: true,
		sameSite: env == 'production' ? 'none' : 'lax',
		secure: env == 'production' ? true : false,
		path: '/',
		maxAge: 1800
	});

	return accessToken;
};

export default refreshAuth;
