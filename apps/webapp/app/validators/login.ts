import vine from '@vinejs/vine';

export const loginValidator = vine.create({
	email: vine.string().email(),
	password: vine.string(),
});
