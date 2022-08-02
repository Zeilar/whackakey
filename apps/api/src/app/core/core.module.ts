import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoreController } from "./core.controller";
import { CoreService } from "./core.service";
import config from "../config";

@Module({
	imports: [
		// @ts-expect-error type bug
		TypeOrmModule.forRoot({
			...config.db,
			entities: [],
		}),
	],
	controllers: [CoreController],
	providers: [CoreService],
})
export class CoreModule {}
