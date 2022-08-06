import { createContext, useEffect, useState } from "react";
import useSoundContext from "../hooks/useSoundContext";
import { DifficultyTiming, Point } from "../types/game";

type Letter = string | null;

interface GameContext {
	isLocked: boolean;
	setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
	letter: Letter;
	setLetter: React.Dispatch<React.SetStateAction<Letter>>;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	difficultyTiming: DifficultyTiming;
	setDifficultyTiming: React.Dispatch<React.SetStateAction<DifficultyTiming>>;
	score: number;
	hit(): void;
	miss(): void;
	play(): void;
	reset(): void;
}

interface GameProps {
	children: React.ReactNode;
}

export const GameContext = createContext({} as GameContext);

export function GameContextProvider({ children }: GameProps) {
	const { playAudio } = useSoundContext();

	const [isLocked, setIsLocked] = useState(true);
	const [letter, setLetter] = useState<string | null>(null);
	const [score, setScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [difficultyTiming, setDifficultyTiming] = useState(DifficultyTiming.EASY);

	useEffect(() => {
		const difficultyTiming = localStorage.getItem("difficultyTiming");
		setDifficultyTiming(difficultyTiming ? JSON.parse(difficultyTiming) : DifficultyTiming.EASY);
	}, []);

	useEffect(() => {
		localStorage.setItem("difficultyTiming", JSON.stringify(difficultyTiming));
	}, [difficultyTiming]);

	function play() {
		setIsLocked(true);
		setLetter(null);
		setScore(0);
		setIsPlaying(true);
	}

	function reset() {
		setIsLocked(true);
		setLetter(null);
		setScore(0);
		setIsPlaying(false);
	}

	function hit() {
		playAudio("hit");
		setScore(p => p + Point.HIT);
	}

	function miss() {
		playAudio("hurt");
		setScore(p => p + Point.MISS);
	}

	const values: GameContext = {
		difficultyTiming,
		setDifficultyTiming,
		isPlaying,
		setIsPlaying,
		letter,
		setLetter,
		isLocked,
		setIsLocked,
		score,
		hit,
		miss,
		play,
		reset,
	};

	return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
}
