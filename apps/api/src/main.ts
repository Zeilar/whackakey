import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CoreModule } from "./app/core/core.module";
import config from "./app/config";

async function bootstrap() {
	const app = await NestFactory.create(CoreModule);

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
		.setGlobalPrefix(config.app.globalPrefix)
		.enableCors({ origin: config.app.corsOrigin, credentials: true });

	await app.listen(config.app.port);

	Logger.log(`Application is running on: ${await app.getUrl()}`, "NestApplication");
}

bootstrap();
