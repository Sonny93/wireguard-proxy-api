import { controllers } from '#generated/controllers';
import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

router
	.group(() => {
		router.get('/login', [controllers.Sessions, 'create']).as('login');
		router.post('/login', [controllers.Sessions, 'store']).as('login.store');
	})
	.use(middleware.guest());

router
	.group(() => {
		router.post('/logout', [controllers.Sessions, 'destroy']).as('logout');
	})
	.use(middleware.auth());
