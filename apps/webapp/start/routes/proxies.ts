import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';

router
	.group(() => {
		router
			.post('/start', [controllers.proxy.StartProxy, 'execute'])
			.as('start');
		router.post('/stop', [controllers.proxy.StopProxy, 'execute']).as('stop');
		router.post('/test', [controllers.proxy.TestProxy, 'execute']).as('test');
		router
			.post('/restart', [controllers.proxy.RestartProxy, 'execute'])
			.as('restart');
		router
			.post('/start-all', [controllers.proxy.StartAllProxies, 'execute'])
			.as('startAll');
		router
			.post('/stop-all', [controllers.proxy.StopAllProxies, 'execute'])
			.as('stopAll');
		router
			.post('/restart-all', [controllers.proxy.RestartAllProxies, 'execute'])
			.as('restartAll');
	})
	.prefix('/proxies')
	.as('proxies');
