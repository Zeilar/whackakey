import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "../features/account/account.entity";
import { AccountModule } from "../features/account/account.module";
import { AuthModule } from "../features/auth/auth.module";
import { User } from "../features/user/user.entity";
import { UserModule } from "../features/user/user.module";
import { CoreController } from "./core.controller";
import { CoreService } from "./core.service";
import { Transaction } from "../features/transaction/transaction.entity";
import { Category } from "../features/category/category.entity";
import config from "../config";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			// @ts-expect-error type bug
			type: config.db.type,
			host: config.db.host,
			port: config.db.port,
			username: config.db.user,
			password: config.db.password,
			database: config.db.database,
			synchronize: config.db.synchronize,
			logging: config.db.logging,
			entities: [User, Account, Transaction, Category],
		}),
		UserModule,
		AccountModule,
		AuthModule,
	],
	controllers: [CoreController],
	providers: [CoreService],
})
export class CoreModule {}
