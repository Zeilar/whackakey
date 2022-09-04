import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoreController } from "./core.controller";
import { CoreService } from "./core.service";
import config from "../config";
import { WebsocketModule } from "../features/websocket/websocket.module";
import { Leaderboard } from "../features/leaderboard/leaderboard.entity";
import { LeaderboardModule } from "../features/leaderboard/leaderboard.module";

@Module({
	imports: [
		LeaderboardModule,
		TypeOrmModule.forRoot({
			...config.db,
			entities: [Leaderboard],
		}),
		WebsocketModule,
	],
	controllers: [CoreController],
	providers: [CoreService],
})
export class CoreModule {}
