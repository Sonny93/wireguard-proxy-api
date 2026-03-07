import vine from '@vinejs/vine';

export const uploadConfigValidator = vine.create({
	configs: vine
		.array(
			vine.file({
				size: '1mb',
				extnames: ['conf'],
			})
		)
		.minLength(1),
});
