import { Controller } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";

@Controller()
export class LeaderboardController {
	public constructor(private readonly leaderboardService: LeaderboardService) {}
}
