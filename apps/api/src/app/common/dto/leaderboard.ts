import { Difficulty, difficulties } from "@shared";
import { IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class HighscoreDto {
	@IsString()
	@Matches(`^(${Object.keys(difficulties).join("|")})$`)
	public difficulty: Difficulty;

	@IsNumber()
	public score: number;

	@MinLength(3)
	@MaxLength(15)
	@IsString()
	public name: string;
}
