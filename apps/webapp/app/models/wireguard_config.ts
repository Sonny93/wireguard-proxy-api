import { WireguardConfigSchema } from '#database/schema';
import User from '#models/user';
import { belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class WireguardConfig extends WireguardConfigSchema {
	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	get displayName(): string {
		return this.name.endsWith('.conf') ? this.name : `${this.name}.conf`;
	}
}
