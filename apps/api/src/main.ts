import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import session from "express-session";
import passport from "passport";
import pgStore from "connect-pg-simple";
import { Pool } from "pg";
import { CoreModule } from "./app/core/core.module";
import config from "./app/config";

const Store = pgStore(session);

async function bootstrap() {
	const app = await NestFactory.create(CoreModule);

	app.use(
		session({
			secret: config.app.sessionSecret,
			resave: false,
			saveUninitialized: true,
			cookie: {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
				secure: false,
			},
			store: new Store({
				createTableIfMissing: true,
				pool: new Pool({
					password: config.db.password,
					database: config.db.database,
					host: config.db.host,
					port: config.db.port,
					user: config.db.user,
				}),
			}),
		}),
		passport.initialize(),
		passport.session()
	)
		.useGlobalPipes(new ValidationPipe({ transform: true }))
		.setGlobalPrefix(config.app.globalPrefix)
		.enableCors({ origin: config.app.corsOrigin, credentials: true });

	await app.listen(config.app.port);

	Logger.log(`Application is running on: ${await app.getUrl()}`, "NestApplication");
}

bootstrap();
