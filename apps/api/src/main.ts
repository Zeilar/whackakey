import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/main/app.module";
import session from "express-session";
import passport from "passport";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "./app/config/env";
import pgStore from "connect-pg-simple";
import { Pool } from "pg";

const Store = pgStore(session);

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService<EnvConfig, true>>(ConfigService);
	const GLOBAL_PREFIX = configService.get("GLOBAL_PREFIX", { infer: true });
	const PORT = configService.get("PORT", { infer: true });

	app.use(
		session({
			secret: configService.get("SESSION_SECRET", { infer: true }),
			resave: false,
			saveUninitialized: true,
			cookie: {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 7 * 30, // One week in milliseconds
				secure: false,
			},
			store: new Store({
				pool: new Pool({
					host: configService.get("DB_HOST", { infer: true }),
					database: configService.get("DB_NAME", { infer: true }),
					port: configService.get("DB_PORT", { infer: true }),
					password: configService.get("DB_PASSWORD", { infer: true }),
					user: configService.get("DB_USERNAME", { infer: true }),
				}),
				createTableIfMissing: true,
			}),
		}),
		passport.initialize(),
		passport.session()
	)
		.useGlobalPipes(new ValidationPipe({ transform: true }))
		.setGlobalPrefix(GLOBAL_PREFIX)
		// .enableCors({ origin: true });
		.enableCors({ origin: configService.get("CORS_ORIGIN", { infer: true }), credentials: true });

	await app.listen(PORT);

	// console.log(configService.get("SECURE", { infer: true }), typeof Boolean(process.env.SECURE));

	Logger.log(`Application is running on: ${await app.getUrl()}`, "NestApplication");
}

bootstrap();
