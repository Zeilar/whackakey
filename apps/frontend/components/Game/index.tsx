import { Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Keyboard from "../../components/Keyboard";
import useGameContext from "../../hooks/useGameContext";

export default function Game() {
	const { score, letter, randomLetter, difficultyTiming, isGameOver, userInput, miss, hasPicked, lives, reset } =
		useGameContext();
	const [nextDeadline, setNextDeadline] = useState<number>(new Date().getTime() + difficultyTiming);
	const timeoutRef = useRef<number | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	useEffect(() => {
		function frameHandler() {
			if (letter === null) {
				randomLetter();
				animationFrameRef.current = requestAnimationFrame(frameHandler);
				return;
			}
			if (nextDeadline - new Date().getTime() >= 0) {
				animationFrameRef.current = requestAnimationFrame(frameHandler);
				return;
			}
			if (!hasPicked || userInput !== letter) {
				miss();
			}
			randomLetter();
			setNextDeadline(new Date().getTime() + difficultyTiming);
		}
		timeoutRef.current = window.setTimeout(() => {
			if (isGameOver) {
				return;
			}
			animationFrameRef.current = requestAnimationFrame(frameHandler);
		}, difficultyTiming);
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [nextDeadline, difficultyTiming, randomLetter, userInput, hasPicked, miss, letter, isGameOver]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	if (isGameOver) {
		return (
			<div>
				<Heading>Game over</Heading>
				<Button variant="key" onClick={reset}>
					Play again
				</Button>
			</div>
		);
	}

	return (
		<Flex flexDir="column" gap={10} justifyContent="center" alignItems="center">
			<Heading
				color="gray.100"
				letterSpacing={4}
				size="4xl"
				sx={{ WebkitTextStrokeWidth: 1, WebkitTextStrokeColor: "var(--chakra-colors-blue-300)" }}
			>
				{score}
			</Heading>
			<Heading
				color="gray.100"
				letterSpacing={4}
				size="4xl"
				sx={{ WebkitTextStrokeWidth: 1, WebkitTextStrokeColor: "var(--chakra-colors-blue-300)" }}
			>
				Lives: {lives}
			</Heading>
			<Keyboard />
		</Flex>
	);
}
