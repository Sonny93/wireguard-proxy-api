import { defaultTableFields } from '#database/default_table_fields';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class CreateWireguardConfigsTable extends BaseSchema {
	protected tableName = 'wireguard_configs';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table
				.integer('user_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE');
			table.string('name', 255).notNullable();
			table.string('private_key').notNullable();

			table.unique(['user_id', 'name']);

			defaultTableFields(table);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
