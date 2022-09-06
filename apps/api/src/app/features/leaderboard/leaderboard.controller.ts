import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Difficulty } from "@shared";
import { HighscoreDto } from "../../common/dto/leaderboard";
import { LeaderboardService } from "./leaderboard.service";

@Controller("/leaderboard")
export class LeaderboardController {
	public constructor(private readonly leaderboardService: LeaderboardService) {}

	@Post("/")
	public highscore(@Body() dto: HighscoreDto) {
		this.leaderboardService.highscore(dto);
	}

	@Get("/:page/:difficulty")
	public leaderboard(@Param("page") page: number, @Param("difficulty") difficulty: Difficulty) {
		if (isNaN(page)) {
			throw new BadRequestException();
		}
		return this.leaderboardService.getLeaderboard(page, difficulty);
	}
}
