import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HighscoreDto } from "../../common/dto/leaderboard";
import { LeaderboardService } from "./leaderboard.service";

@Controller("/leaderboard")
export class LeaderboardController {
	public constructor(private readonly leaderboardService: LeaderboardService) {}

	@Post("/")
	public highscore(@Body() dto: HighscoreDto) {
		this.leaderboardService.highscore(dto);
	}

	@Get("/:page")
	public leaderboard(@Param("page") page: number) {
		if (isNaN(page)) {
			throw new BadRequestException();
		}
		return this.leaderboardService.getLeaderboard(page);
	}
}
