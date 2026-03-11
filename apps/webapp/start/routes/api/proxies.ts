import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';

router
	.group(() => {
		router.get('/', [controllers.api.proxy.GetProxies, 'render']).as('index');
		router.get('/pick', [controllers.api.proxy.PickProxy, 'handle']).as('pick');
		router
			.get('/:configName/test', [controllers.api.proxy.TestProxy, 'handle'])
			.as('test');
	})
	.prefix('/proxies')
	.as('api.proxies');
