export type EnvConfig = typeof config;

const config = {
	PORT: parseInt(process.env.PORT),
	GLOBAL_PREFIX: process.env.GLOBAL_PREFIX,
	CORS_ORIGIN: process.env.CORS_ORIGIN,
	SESSION_SECRET: process.env.SESSION_SECRET,
	SECURE: Boolean(process.env.SECURE),
	DB_TYPE: process.env.DB_TYPE,
	DB_HOST: process.env.DB_HOST,
	DB_PORT: parseInt(process.env.DB_PORT),
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_SYNCHRONIZE: Boolean(process.env.DB_SYNCHRONIZE),
	DB_LOGGING: Boolean(process.env.DB_LOGGING),
	OAUTH_GITHUB_CLIENT_ID: process.env.OAUTH_GITHUB_CLIENT_ID,
	OAUTH_GITHUB_SECRET: process.env.OAUTH_GITHUB_SECRET,
	OAUTH_GITHUB_CALLBACK_URL: process.env.OAUTH_GITHUB_CALLBACK_URL,
};

const envConfig = () => config;

export default envConfig;
