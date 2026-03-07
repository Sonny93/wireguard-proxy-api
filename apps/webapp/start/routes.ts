import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';

router
	.group(() => {
		router.get('/', [controllers.Configs, 'index']).as('home');
		router.post('/configs', [controllers.Configs, 'store']).as('configs.store');
	})
	.use(middleware.auth());

router
	.get('/login', [controllers.Sessions, 'create'])
	.as('login')
	.use(middleware.guest());
router
	.post('/login', [controllers.Sessions, 'store'])
	.as('login.store')
	.use(middleware.guest());
router
	.post('/logout', [controllers.Sessions, 'destroy'])
	.as('logout')
	.use(middleware.auth());
