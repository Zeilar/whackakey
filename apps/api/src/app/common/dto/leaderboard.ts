import { Difficulty, difficulties } from "@shared";
import { IsNumber, IsString, Matches } from "class-validator";

export class HighscoreDto {
	@IsString()
	@Matches(`/${Object.keys(difficulties).join("|")}/`)
	public difficulty: Difficulty;

	@IsNumber()
	public score: number;

	@IsString()
	public name: string;
}
