import { User } from '$lib/_db/models/User';
import type { UserDocument } from '$lib/_db/mongoose.gen';
import type { UserFormData, NewUserFormData } from '$lib/types';

export const findUserById = (id: string): Promise<UserDocument | null> => {
	return User.findById(id).select('email username scope name birthdate createdAt').exec();
};

export const addNewUserFormData = (
	userId: string,
	formData: NewUserFormData
): Promise<UserDocument> => {
	return User.findById(userId)
		.exec()
		.then((user) => {
			if (!user) throw Error('no user found with matching userId');
			const { name, birthdate } = formData;
			const { first, last } = name;
			user.name = { first, last };
			user.birthdate = birthdate;
			return user.save();
		});
};

export const updateUserData = (userId: string, formData: UserFormData): Promise<UserDocument> => {
	return User.findById(userId)
		.exec()
		.then((user) => {
			if (!user) throw Error('no user found with matching userId');
			const { name } = formData;
			if (name) {
				const { first, last } = name;
				if (first && user.name.first !== first) {
					user.name.first = first;
				}
				if (last && user.name.last !== last) {
					user.name.last = last;
				}
			}
			return user.save();
		});
};
