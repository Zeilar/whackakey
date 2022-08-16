import { useCallback, useState, useEffect } from "react";
import { randomUniqueLetter } from "../common/utils";
import { Point } from "../types/game";
import { useSoundContext } from ".";
import { DEFAULT_LIVES, Difficulty, difficultyInMs } from "@shared";

export interface SoloGame {
	nextDeadline: number;
	lives: number;
	letter: Letter;
	userInput: Letter;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	difficulty: Difficulty;
	setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
	timeLeft: number;
	setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
	hasPicked: boolean;
	score: number;
	isGameOver: boolean;
	hit(): void;
	miss(): void;
	play(): void;
	reset(): void;
	pick(letter: string): void;
	nextRound(): void;
	randomLetter(): void;
}

type Letter = string | null;

export function useSoloGame(): SoloGame {
	const { playAudio } = useSoundContext();
	const [lives, setLives] = useState(DEFAULT_LIVES);
	const [isGameOver, setIsGameOver] = useState(false);
	const [userInput, setUserInput] = useState<Letter>(null);
	const [letter, setLetter] = useState<Letter>(null);
	const [score, setScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const [nextDeadline, setNextDeadline] = useState(new Date().getTime() + difficultyInMs(difficulty));
	const [timeLeft, setTimeLeft] = useState(difficultyInMs(difficulty));

	const randomLetter = useCallback(() => {
		setLetter(randomUniqueLetter(letter));
	}, [letter]);

	const nextRound = useCallback(() => {
		setUserInput(null);
		randomLetter();
		setNextDeadline(new Date().getTime() + difficultyInMs(difficulty));
	}, [difficulty, randomLetter]);

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
		setTimeLeft(difficultyInMs(difficulty));
		setIsGameOver(false);
	}, [difficulty]);

	const play = useCallback(() => {
		restart();
		setIsPlaying(true);
	}, [restart]);

	const reset = useCallback(() => {
		restart();
		setIsPlaying(false);
	}, [restart]);

	useEffect(() => {
		const difficulty = localStorage.getItem("difficulty");
		setDifficulty(difficulty ? JSON.parse(difficulty) : "easy");
	}, []);

	useEffect(() => {
		localStorage.setItem("difficulty", JSON.stringify(difficulty));
	}, [difficulty]);

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
		difficulty,
		setDifficulty,
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
	};
}
