import { Injectable } from "@nestjs/common";
import { HighscoreDto } from "../../common/dto/leaderboard";
import { Leaderboard } from "./leaderboard.entity";

const PER_PAGE = 100;

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
