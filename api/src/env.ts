require('dotenv').config();
console.log(require('dotenv').config());

const CLUSTER_URI = process.env.ENV_MONGO_URI;

export const env = Object.freeze(
	{
		PORT: process.env.PORT || 8080,	// for compatibility with Heroku

		NODE_ENV: 'development',

		MONGO_URL: CLUSTER_URI,
		DB_NAME: 'FoodSpyDb',

		USERS_ROUTE: '/db/users',

		REGISTER_ROUTE: '/auth/register',
		LOGIN_ROUTE: '/auth/login'
	}
);
