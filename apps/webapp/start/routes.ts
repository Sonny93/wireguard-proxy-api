import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';

import '#routes/api/proxies';
import '#routes/auth';
import '#routes/configs';
import '#routes/proxies';

router
	.get('/', [controllers.config.ShowConfigs, 'render'])
	.as('home')
	.use(middleware.auth());

router
	.get('/proxy/initializing', [controllers.proxy.Initializing, 'render'])
	.as('proxy.initializing');
