const app = {
	port: parseInt(process.env.PORT),
	globalPrefix: process.env.GLOBAL_PREFIX,
	corsOrigin: process.env.CORS_ORIGIN,
	sessionSecret: process.env.SESSION_SECRET,
};

export default app;
