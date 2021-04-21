require('dotenv').config();

import { log } from './shared/Logger';
log('env.ts', 'global call', `require('dotenv').config():`, require('dotenv').config());

import { Constants } from './shared/Constants';

const CLUSTER_URI = process.env.ENV_MONGO_URI;

export const env = Object.freeze(
	{
		PORT: process.env.PORT || 8080,	// for compatibility with Heroku

		NODE_ENV: 'development',

		MONGO_URL: CLUSTER_URI,
		DB_NAME: 'FoodSpyDb',

		USERS_ROUTE: '/db/users',

		REGISTER_ROUTE: Constants.APIEndpoints.REGISTER_URL,
		LOGIN_ROUTE: Constants.APIEndpoints.LOGIN_URL
	}
);
