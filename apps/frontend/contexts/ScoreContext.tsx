import { createContext, useState } from "react";
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
		setScore(p => p + Point.HIT);
	}

	function miss() {
		setScore(p => p + Point.MISS);
	}

	const values: ScoreContext = {
		score,
		hit,
		miss,
	};

	return <ScoreContext.Provider value={values}>{children}</ScoreContext.Provider>;
}
