import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';

router
	.group(() => {
		router.post('/', [controllers.config.UploadConfig, 'execute']).as('store');
		router
			.delete('/:id', [controllers.config.DeleteConfig, 'execute'])
			.as('destroy');
	})
	.prefix('/configs')
	.as('configs');
