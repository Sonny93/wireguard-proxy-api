import WireguardConfig from '#models/wireguard_config';
import vine from '@vinejs/vine';

const base64PrivateKey = () =>
	vine
		.string()
		.minLength(1)
		.regex(/^[A-Za-z0-9+/]+=*$/);

export const uploadConfigValidator = vine.create({
	configs: vine
		.array(
			vine.object({
				name: vine.string().trim().minLength(1).maxLength(255),
				privateKey: base64PrivateKey(),
			})
		)
		.minLength(1),
});

export const deleteConfigValidator = vine.create({
	params: vine.object({
		configId: vine
			.number()
			.positive()
			.exists({ table: WireguardConfig.table, column: 'id' }),
	}),
});
