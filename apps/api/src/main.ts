import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/main/app.module";
import session from "express-session";
import passport from "passport";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "./app/config/env";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService<EnvConfig, true>>(ConfigService);
	const GLOBAL_PREFIX = configService.get("GLOBAL_PREFIX", { infer: true });
	const PORT = configService.get("PORT", { infer: true });

	app.setGlobalPrefix(GLOBAL_PREFIX)
		.use(
			session({
				secret: configService.get("SESSION_SECRET", { infer: true }),
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					sameSite: "strict",
					maxAge: 1000 * 60 * 60 * 24 * 7,
					secure: configService.get("SECURE", { infer: true }),
				},
			}),
			passport.initialize(),
			passport.session()
		)
		.useGlobalPipes(new ValidationPipe({ transform: true }))
		.enableCors({ origin: configService.get("CORS_ORIGIN", { infer: true }), credentials: true });

	await app.listen(PORT);

	Logger.log(`Application is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`, "NestApplication");
}

bootstrap();
