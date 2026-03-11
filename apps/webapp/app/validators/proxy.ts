import WireguardConfig from '#models/wireguard_config';
import vine from '@vinejs/vine';

export const actionProxyValidator = vine.create({
	params: vine.object({
		configId: vine
			.number()
			.positive()
			.exists({ table: WireguardConfig.table, column: 'id' }),
	}),
});
