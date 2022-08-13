export type Difficulty = "easy" | "medium" | "hard";

export enum DifficultyTiming {
	EASY = 1000,
	MEDIUM = 750,
	HARD = 500,
}

export interface Player {
	name: string;
	id: string;
	lives: number;
	isEliminated: boolean;
	wins: number;
	pick: string | null;
}
