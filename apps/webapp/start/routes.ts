import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';

router
	.get('/api/proxies', [controllers.api.proxy.GetProxies, 'render'])
	.as('api.proxies.index');

router
	.group(() => {
		router.get('/', [controllers.Configs, 'index']).as('home');
		router.post('/configs', [controllers.Configs, 'store']).as('configs.store');
		router
			.post('/proxies/start', [controllers.proxy.StartProxy, 'execute'])
			.as('proxies.start');
		router
			.post('/proxies/stop', [controllers.proxy.StopProxy, 'execute'])
			.as('proxies.stop');
		router
			.post('/proxies/test', [controllers.proxy.TestProxy, 'execute'])
			.as('proxies.test');

		router.post('/logout', [controllers.Sessions, 'destroy']).as('logout');
	})
	.use(middleware.auth());

router
	.group(() => {
		router.get('/login', [controllers.Sessions, 'create']).as('login');
		router.post('/login', [controllers.Sessions, 'store']).as('login.store');
	})
	.use(middleware.guest());
