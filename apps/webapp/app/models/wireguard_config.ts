import AppBaseModel from '#models/app_base_model';
import User from '#models/user';
import { belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class WireguardConfig extends AppBaseModel {
	@column()
	declare userId: number;

	@column()
	declare name: string;

	@column({ serializeAs: null })
	declare privateKey: string;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	get displayName(): string {
		return this.name.endsWith('.conf') ? this.name : `${this.name}.conf`;
	}
}
