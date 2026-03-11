import { UserSchema } from '#database/schema';
import WireguardConfig from '#models/wireguard_config';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { compose } from '@adonisjs/core/helpers';
import hash from '@adonisjs/core/services/hash';
import { hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
	@hasMany(() => WireguardConfig)
	declare wireguardConfigs: HasMany<typeof WireguardConfig>;
}
