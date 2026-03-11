import vine from '@vinejs/vine';

export const actionProxyValidator = vine.create({
	configName: vine.string().trim().minLength(1).maxLength(255),
});
