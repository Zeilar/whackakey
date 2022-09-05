import { Injectable } from "@nestjs/common";
import { PER_PAGE } from "@shared";
import { HighscoreDto } from "../../common/dto/leaderboard";
import { Leaderboard } from "./leaderboard.entity";

@Injectable()
export class LeaderboardService {
	public highscore(dto: HighscoreDto) {
		Leaderboard.insert(dto);
	}

	public getLeaderboard(page: number) {
		return Leaderboard.find({
			order: { score: { direction: "DESC" } },
			take: PER_PAGE,
			skip: (page - 1) * PER_PAGE,
		});
	}
}
