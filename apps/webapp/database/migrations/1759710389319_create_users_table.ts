import { defaultTableFields } from '#database/default_table_fields';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class CreateUsersTable extends BaseSchema {
	protected tableName = 'users';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.string('full_name').nullable();
			table.string('email', 254).notNullable().unique();
			table.string('password').notNullable();

			defaultTableFields(table);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
