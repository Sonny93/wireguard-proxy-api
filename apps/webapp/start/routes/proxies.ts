import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';

router
	.group(() => {
		router
			.post('/start', [controllers.proxy.all.StartAllProxies, 'execute'])
			.as('start');
		router
			.post('/stop', [controllers.proxy.all.StopAllProxies, 'execute'])
			.as('stop');
		router
			.post('/restart', [controllers.proxy.all.RestartAllProxies, 'execute'])
			.as('restart');
		router
			.post('/test', [controllers.proxy.all.TestAllProxies, 'execute'])
			.as('test');
	})
	.prefix('/proxies/all')
	.as('proxies.all');

router
	.group(() => {
		router
			.post('/:configId/start', [controllers.proxy.StartProxy, 'execute'])
			.as('start');
		router
			.post('/:configId/stop', [controllers.proxy.StopProxy, 'execute'])
			.as('stop');
		router
			.post('/:configId/test', [controllers.proxy.TestProxy, 'execute'])
			.as('test');
		router
			.post('/:configId/restart', [controllers.proxy.RestartProxy, 'execute'])
			.as('restart');
	})
	.prefix('/proxies')
	.as('proxies');
