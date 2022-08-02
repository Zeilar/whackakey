import { Injectable } from "@nestjs/common";

@Injectable()
export class LeaderboardService {
	getData(): { message: string } {
		return { message: "Welcome to api!" };
	}
}
