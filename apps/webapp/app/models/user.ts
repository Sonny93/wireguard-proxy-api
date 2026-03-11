import AppBaseModel from '#models/app_base_model';
import WireguardConfig from '#models/wireguard_config';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { compose } from '@adonisjs/core/helpers';
import hash from '@adonisjs/core/services/hash';
import { column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
	uids: ['email'],
	passwordColumnName: 'password',
});

export default class User extends compose(AppBaseModel, AuthFinder) {
	@column()
	declare fullName: string | null;

	@column()
	declare email: string;

	@column({ serializeAs: null })
	declare password: string;

	@hasMany(() => WireguardConfig)
	declare wireguardConfigs: HasMany<typeof WireguardConfig>;
}
