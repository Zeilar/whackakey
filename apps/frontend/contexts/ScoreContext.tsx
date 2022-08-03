import { createContext, useState } from "react";
import { soundEffectVolume } from "../common/config";
import { playAudio } from "../common/helpers";
import { Point } from "../types/game";

interface ScoreContext {
	score: number;
	hit(): void;
	miss(): void;
}

interface ScoreProps {
	children: React.ReactNode;
}

export const ScoreContext = createContext({} as ScoreContext);

export function ScoreContextProvider({ children }: ScoreProps) {
	const [score, setScore] = useState(0);

	function hit() {
		playAudio("hit");
		setScore(p => p + Point.HIT);
	}

	function miss() {
		playAudio("hurt");
		setScore(p => p + Point.MISS);
	}

	const values: ScoreContext = {
		score,
		hit,
		miss,
	};

	return <ScoreContext.Provider value={values}>{children}</ScoreContext.Provider>;
}
