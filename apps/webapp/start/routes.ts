import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';

router
	.get('/api/proxies', [controllers.api.proxy.GetProxies, 'render'])
	.as('api.proxies.index');

router
	.group(() => {
		router.get('/', [controllers.config.ShowConfigs, 'render']).as('home');
		router
			.post('/configs', [controllers.config.UploadConfig, 'execute'])
			.as('configs.store');
		router
			.post('/proxies/start', [controllers.proxy.StartProxy, 'execute'])
			.as('proxies.start');
		router
			.post('/proxies/stop', [controllers.proxy.StopProxy, 'execute'])
			.as('proxies.stop');
		router
			.post('/proxies/test', [controllers.proxy.TestProxy, 'execute'])
			.as('proxies.test');
		router
			.post('/proxies/restart', [controllers.proxy.RestartProxy, 'execute'])
			.as('proxies.restart');
		router
			.post('/proxies/start-all', [
				controllers.proxy.StartAllProxies,
				'execute',
			])
			.as('proxies.startAll');
		router
			.post('/proxies/stop-all', [controllers.proxy.StopAllProxies, 'execute'])
			.as('proxies.stopAll');
		router
			.post('/proxies/restart-all', [
				controllers.proxy.RestartAllProxies,
				'execute',
			])
			.as('proxies.restartAll');

		router.post('/logout', [controllers.Sessions, 'destroy']).as('logout');
	})
	.use(middleware.auth());

router
	.group(() => {
		router.get('/login', [controllers.Sessions, 'create']).as('login');
		router.post('/login', [controllers.Sessions, 'store']).as('login.store');
	})
	.use(middleware.guest());
