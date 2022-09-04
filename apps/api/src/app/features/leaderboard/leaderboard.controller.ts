import { Body, Controller, Get, Post } from "@nestjs/common";
import { HighscoreDto } from "../../common/dto/leaderboard";
import { LeaderboardService } from "./leaderboard.service";

@Controller("/leaderboard")
export class LeaderboardController {
	public constructor(private readonly leaderboardService: LeaderboardService) {}

	@Post("/")
	public highscore(@Body() dto: HighscoreDto) {
		this.leaderboardService.highscore(dto);
	}

	@Get("/")
	public leaderboard() {
		return this.leaderboardService.getLeaderboard();
	}
}
