import { Column, ColumnOptions } from 'typeorm';
import { v4 as uuid } from 'uuid';

export function GetCompatibleColumnType(options: ColumnOptions): PropertyDecorator {
	if (process.env['PICKIT_ENV'] === 'e2e') {
		if (options.type === 'enum') {
			options.type = 'varchar';
		}
		if (options.type === 'uuid') {
			options.type = 'varchar';
			options.default = uuid();
		}
		if (options.type === 'bool') {
			options.type = 'integer';
		}
		if (options.type === 'timestamp') {
			options.type = 'datetime';
		}
	}

	return Column(options);
}