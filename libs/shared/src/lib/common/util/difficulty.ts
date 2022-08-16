import { difficulties, Difficulty } from "../../types";

export function difficultyInMs(difficulty: Difficulty) {
	return difficulties[difficulty];
}
