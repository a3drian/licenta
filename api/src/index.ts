import { env } from './env';
import { makeApp } from './app';

import { Application } from 'express';
import { log } from './shared/Logger';

makeApp()
	.then(
		(app: Application) =>
			app.listen(
				env.PORT,
				() => {
					log('index.ts', 'makeApp().then().app.listen', 'connected to MongoDB');
					log('index.ts', 'makeApp().then().app.listen', `${env.NODE_ENV} server listening on port ${env.PORT}`);
				}
			)
	)
	.catch(
		(error: any) => {
			log('index.ts', 'makeApp().catch()', `(index.ts) error: ${error}`);
		}
	);

log('index.ts', 'global call', '');
