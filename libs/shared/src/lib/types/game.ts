export type Difficulty = "easy" | "medium" | "hard";

export const difficulties: Record<Difficulty, number> = {
	easy: 1000,
	medium: 750,
	hard: 500,
};

export interface Player {
	name: string;
	id: string;
	lives: number;
	isEliminated: boolean;
	wins: number;
	pick: string | null;
}
