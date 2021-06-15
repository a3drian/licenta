require('dotenv').config();

import { log } from './shared/Logger';
log('env.ts', 'global call', `require('dotenv').config():`, require('dotenv').config());

import { Constants } from './shared/Constants';

let NODE_ENVIRONMENT: string;
if (Constants.IN_DEBUG_MODE === true) {
	NODE_ENVIRONMENT = Constants.DEVELOPMENT_MODE;
} else {
	NODE_ENVIRONMENT = Constants.PRODUCTION_MODE;
}

const CLUSTER_URI = process.env.ENV_MONGO_URI;
const ENV_TOKEN_SECRET: string = process.env.ENV_TOKEN_SECRET ?
	process.env.ENV_TOKEN_SECRET : '';

export const env = Object.freeze(
	{
		PORT: process.env.PORT || 8080,	// for compatibility with Heroku

		NODE_ENV: NODE_ENVIRONMENT,

		MONGO_URL: CLUSTER_URI,
		DB_NAME: 'FoodSpyDb',
		TEST_DB_NAME: 'FoodSpyDbTest',

		USERS_ROUTE: '/db/users',

		REGISTER_ROUTE: Constants.APIEndpoints.REGISTER_URL,
		LOGIN_ROUTE: Constants.APIEndpoints.LOGIN_URL,

		TOKEN_SECRET: ENV_TOKEN_SECRET,
	}
);
