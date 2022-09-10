import { Difficulty, difficulties, NAME_MIN_LENGTH, NAME_MAX_LENGTH } from "@shared";
import { IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class HighscoreDto {
	@IsString()
	@Matches(`^(${Object.keys(difficulties).join("|")})$`)
	public difficulty: Difficulty;

	@IsNumber()
	public score: number;

	@MinLength(NAME_MIN_LENGTH)
	@MaxLength(NAME_MAX_LENGTH)
	@IsString()
	public name: string;
}
