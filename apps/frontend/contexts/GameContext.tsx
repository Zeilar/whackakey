import { createContext, useCallback, useEffect, useState } from "react";
import { alphabet } from "../common/constants";
import useSoundContext from "../hooks/useSoundContext";
import { DifficultyTiming, Point } from "../types/game";

type Letter = string | null;

interface GameContext {
	lives: number;
	letter: Letter;
	userInput: Letter;
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
	randomLetter(): void;
	pick(letter: string): void;
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
	const [hasPicked, setHasPicked] = useState(false);

	useEffect(() => {
		const difficultyTiming = localStorage.getItem("difficultyTiming");
		setDifficultyTiming(difficultyTiming ? JSON.parse(difficultyTiming) : DifficultyTiming.EASY);
	}, []);

	useEffect(() => {
		localStorage.setItem("difficultyTiming", JSON.stringify(difficultyTiming));
	}, [difficultyTiming]);

	console.log({ lives });

	useEffect(() => {
		if (lives > 0) {
			return;
		}
		setIsGameOver(true);
	}, [lives]);

	useEffect(() => {
		setHasPicked(false);
		setUserInput(null);
	}, [letter]);

	const pick = useCallback((letter: string) => {
		setUserInput(letter);
		setHasPicked(true);
	}, []);

	const randomLetter = useCallback(() => {
		setLetter(alphabet[Math.floor(alphabet.length * Math.random())]);
	}, []);

	const restart = useCallback(() => {
		setUserInput(null);
		setLetter(null);
		setScore(0);
		setIsGameOver(false);
	}, []);

	const play = useCallback(() => {
		restart();
		setIsPlaying(true);
	}, [restart]);

	const reset = useCallback(() => {
		restart();
		setIsPlaying(false);
	}, [restart]);

	const hit = useCallback(() => {
		playAudio("hit");
		setScore(p => p + Point.HIT);
	}, [playAudio]);

	const miss = useCallback(() => {
		playAudio("hurt");
		setScore(p => p + Point.MISS);
		if (lives > 0) {
			setLives(p => p - 1);
		}
	}, [playAudio, lives]);

	const values: GameContext = {
		difficultyTiming,
		setDifficultyTiming,
		isPlaying,
		setIsPlaying,
		letter,
		score,
		hit,
		miss,
		play,
		reset,
		lives,
		isGameOver,
		userInput,
		hasPicked,
		randomLetter,
		pick,
	};

	return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
}
