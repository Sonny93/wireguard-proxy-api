import vine from '@vinejs/vine';

export const actionProxyValidator = vine.create({
	configName: vine.string().minLength(1),
});
