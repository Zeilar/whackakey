const db = {
	type: process.env.DB_TYPE,
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: process.env.DB_SYNCHRONIZE === "true",
	logging: process.env.DB_LOGGING === "true",
};

export default db;
