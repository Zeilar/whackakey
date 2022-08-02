import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeaderboardController } from "./leaderboard.controller";
import { LeaderboardService } from "./leaderboard.service";
import config from "../../config";

@Module({
	imports: [
		// @ts-expect-error type bug
		TypeOrmModule.forRoot({
			...config.db,
			entities: [],
		}),
	],
	controllers: [LeaderboardController],
	providers: [LeaderboardService],
})
export class LeaderboardModule {}
