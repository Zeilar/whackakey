import { createContext, useEffect, useMemo, useState } from "react";
import useSoundContext from "../hooks/useSoundContext";
import { DifficultyTiming, Point } from "../types/game";

type Letter = string | null;

interface GameContext {
	lives: number;
	letter: Letter;
	setLetter: React.Dispatch<React.SetStateAction<Letter>>;
	userInput: Letter;
	setUserInput: React.Dispatch<React.SetStateAction<Letter>>;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	difficultyTiming: DifficultyTiming;
	setDifficultyTiming: React.Dispatch<React.SetStateAction<DifficultyTiming>>;
	hasPicked: boolean;
	score: number;
	isGameOver: boolean;
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
	const [lives, setLives] = useState(3);
	const [isGameOver, setIsGameOver] = useState(false);
	const [userInput, setUserInput] = useState<Letter>(null);
	const [letter, setLetter] = useState<Letter>(null);
	const [score, setScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [difficultyTiming, setDifficultyTiming] = useState(DifficultyTiming.EASY);
	const hasPicked = useMemo(() => userInput !== null, [userInput]);

	useEffect(() => {
		const difficultyTiming = localStorage.getItem("difficultyTiming");
		setDifficultyTiming(difficultyTiming ? JSON.parse(difficultyTiming) : DifficultyTiming.EASY);
	}, []);

	useEffect(() => {
		localStorage.setItem("difficultyTiming", JSON.stringify(difficultyTiming));
	}, [difficultyTiming]);

	useEffect(() => {
		if (lives > 0) {
			return;
		}
		setIsGameOver(true);
	}, [lives]);

	function restart() {
		setUserInput(null);
		setLetter(null);
		setScore(0);
		setIsGameOver(false);
	}

	function play() {
		restart();
		setIsPlaying(true);
	}

	function reset() {
		restart();
		setIsPlaying(false);
	}

	function hit() {
		playAudio("hit");
		setScore(p => p + Point.HIT);
	}

	function miss() {
		playAudio("hurt");
		setScore(p => p + Point.MISS);
		setLives(p => p - 1);
	}

	const values: GameContext = {
		difficultyTiming,
		setDifficultyTiming,
		isPlaying,
		setIsPlaying,
		letter,
		setLetter,
		score,
		hit,
		miss,
		play,
		reset,
		lives,
		isGameOver,
		userInput,
		setUserInput,
		hasPicked,
	};

	return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
}
