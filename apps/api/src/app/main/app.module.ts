import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "../account/account.entity";
import { AccountModule } from "../account/account.module";
import { AuthModule } from "../auth/auth.module";
import envConfig from "../config/env";
import { User } from "../user/user.entity";
import { UserModule } from "../user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

const { DB_HOST, DB_LOGGING, DB_NAME, DB_PASSWORD, DB_PORT, DB_SYNCHRONIZE, DB_TYPE, DB_USERNAME } = process.env;

console.log(DB_PASSWORD);

@Module({
	imports: [
		ConfigModule.forRoot({ load: [envConfig] }),
		TypeOrmModule.forRoot({
			type: DB_TYPE,
			host: DB_HOST,
			port: parseInt(DB_PORT),
			username: DB_USERNAME,
			password: DB_PASSWORD,
			database: DB_NAME,
			entities: [User, Account],
			synchronize: DB_SYNCHRONIZE === "true",
			logging: DB_LOGGING === "true",
		}),
		UserModule,
		AccountModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
