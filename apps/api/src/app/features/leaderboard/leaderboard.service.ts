import { Injectable } from "@nestjs/common";
import { Difficulty, PER_PAGE } from "@shared";
import { HighscoreDto } from "../../common/dto/leaderboard";
import { Leaderboard } from "./leaderboard.entity";

@Injectable()
export class LeaderboardService {
	public highscore(dto: HighscoreDto) {
		Leaderboard.insert(dto);
	}

	public async getLeaderboard(page: number, difficulty: Difficulty) {
		const leaderboard = await Leaderboard.find({
			where: { difficulty },
			order: { score: { direction: "DESC" } },
			take: PER_PAGE,
			skip: (page - 1) * PER_PAGE,
		});
		return { leaderboard, total: await Leaderboard.countBy({ difficulty }) };
	}
}
