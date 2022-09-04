import { Injectable } from "@nestjs/common";
import { HighscoreDto } from "../../common/dto/leaderboard";
import { Leaderboard } from "./leaderboard.entity";

@Injectable()
export class LeaderboardService {
	public highscore(dto: HighscoreDto) {
		Leaderboard.insert(dto);
	}

	public getLeaderboard() {
		return Leaderboard.find({ order: { score: { direction: "DESC" } }, take: 100 });
	}
}
