export {};

type BooleanString = "true" | "false";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			GLOBAL_PREFIX: string;
			CORS_ORIGIN: string;
			SESSION_SECRET: string;
			SECURE: BooleanString;
			DB_TYPE: "mysql" | "postgres" | "mariadb" | "sqlite";
			DB_HOST: string;
			DB_PORT: string;
			DB_USERNAME: string;
			DB_PASSWORD: string;
			DB_NAME: string;
			DB_SYNCHRONIZE: BooleanString;
			DB_LOGGING: BooleanString;
			OAUTH_GITHUB_CLIENT_ID: string;
			OAUTH_GITHUB_SECRET: string;
			OAUTH_GITHUB_CALLBACK_URL: string;
		}
	}
}
