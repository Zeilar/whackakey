import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoreController } from "./core.controller";
import { CoreService } from "./core.service";
import config from "../config";
import { WebsocketModule } from "../features/websocket/websocket.module";

@Module({
	imports: [
		// TypeOrmModule.forRoot({
		// 	...config.db,
		// 	entities: [],
		// }),
		WebsocketModule,
	],
	controllers: [CoreController],
	providers: [CoreService],
})
export class CoreModule {}
