import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';

router
	.group(() => {
		router.post('/', [controllers.config.CreateConfig, 'execute']).as('create');
		router
			.delete('/:configId', [controllers.config.DeleteConfig, 'execute'])
			.as('delete');
	})
	.prefix('/configs')
	.as('configs');
