import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function serverlessConnect(mongooseURI: string): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {};

		cached.promise = mongoose.connect(mongooseURI, opts).then((mongoose) => {
			return mongoose;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
