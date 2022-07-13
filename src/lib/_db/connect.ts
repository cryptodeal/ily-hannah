import mongoose from 'mongoose';
import config from '$lib/_config';
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function serverlessConnect(mongooseURI: string): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			useNewUrlParser: true,
			dbName: config.MONGO_DB
		};

		cached.promise = mongoose.connect(mongooseURI, opts).then((mongoose) => {
			return mongoose;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
