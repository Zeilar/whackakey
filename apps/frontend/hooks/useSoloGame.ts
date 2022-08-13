import { useCallback, useState, useEffect } from "react";
import { DEFAULT_LIVES } from "../common/constants";
import { randomUniqueLetter } from "../common/utils";
import { DifficultyTiming, Mode, Point } from "../types/game";
import { useSoundContext } from ".";

export interface SoloGame {
	nextDeadline: number;
	lives: number;
	letter: Letter;
	userInput: Letter;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	difficultyTiming: DifficultyTiming;
	setDifficultyTiming: React.Dispatch<React.SetStateAction<DifficultyTiming>>;
	timeLeft: DifficultyTiming;
	setTimeLeft: React.Dispatch<React.SetStateAction<DifficultyTiming>>;
	hasPicked: boolean;
	score: number;
	isGameOver: boolean;
	mode: Mode;
	setMode: React.Dispatch<React.SetStateAction<Mode>>;
	hit(): void;
	miss(): void;
	play(): void;
	reset(): void;
	pick(letter: string): void;
	nextRound(): void;
	randomLetter(): void;
}

type Letter = string | null;

export function useSoloGame() {
	const { playAudio } = useSoundContext();
	const [lives, setLives] = useState(DEFAULT_LIVES);
	const [isGameOver, setIsGameOver] = useState(false);
	const [userInput, setUserInput] = useState<Letter>(null);
	const [letter, setLetter] = useState<Letter>(null);
	const [score, setScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [difficultyTiming, setDifficultyTiming] = useState(DifficultyTiming.EASY);
	const [nextDeadline, setNextDeadline] = useState(new Date().getTime() + difficultyTiming);
	const [timeLeft, setTimeLeft] = useState(difficultyTiming);
	const [mode, setMode] = useState<Mode>("solo");

	const randomLetter = useCallback(() => {
		setLetter(randomUniqueLetter(letter));
	}, [letter]);

	const nextRound = useCallback(() => {
		setUserInput(null);
		randomLetter();
		setNextDeadline(new Date().getTime() + difficultyTiming);
	}, [difficultyTiming, randomLetter]);

	const hit = useCallback(() => {
		playAudio("hit");
		setScore(p => p + Point.HIT);
		nextRound();
	}, [playAudio, nextRound]);

	const miss = useCallback(() => {
		playAudio("hurt");
		setScore(p => p + Point.MISS);
		if (lives > 0) {
			setLives(p => p - 1);
		}
		nextRound();
	}, [playAudio, lives, nextRound]);

	const pick = useCallback((letter: string) => {
		setUserInput(letter);
	}, []);

	const restart = useCallback(() => {
		setUserInput(null);
		setLetter(null);
		setLives(DEFAULT_LIVES);
		setScore(0);
		setTimeLeft(difficultyTiming);
		setIsGameOver(false);
	}, [difficultyTiming]);

	const play = useCallback(() => {
		restart();
		setIsPlaying(true);
	}, [restart]);

	const reset = useCallback(() => {
		restart();
		setIsPlaying(false);
	}, [restart]);

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

	useEffect(() => {
		if (isPlaying) {
			return;
		}
		reset();
	}, [isPlaying, reset]);

	return {
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
		hasPicked: userInput !== null,
		pick,
		nextDeadline,
		nextRound,
		randomLetter,
		setTimeLeft,
		timeLeft,
		mode,
		setMode,
	} as SoloGame;
}
