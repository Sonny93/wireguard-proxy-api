import WireguardConfig from '#models/wireguard_config';
import { BaseTransformer } from '@adonisjs/core/transformers';

export default class ConfigTransformer extends BaseTransformer<WireguardConfig> {
	toObject() {
		return this.pick(this.resource, ['id', 'name']);
	}
}
