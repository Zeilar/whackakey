import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Keyboard from "../../components/Keyboard";
import useGameContext from "../../hooks/useGameContext";
import SolidButton from "../FloatingText/SolidButton";

export default function Game() {
	const { score, letter, randomLetter, difficultyTiming, isGameOver, userInput, miss, hasPicked, lives, reset } =
		useGameContext();
	const [nextDeadline, setNextDeadline] = useState<number>(new Date().getTime() + difficultyTiming);
	const [difference, setDifference] = useState(difficultyTiming);
	const animationFrameRef = useRef<number | undefined>();
	const [isFirstRound, setIsFirstRound] = useState(true);

	useEffect(() => {
		function frameHandler() {
			if (isGameOver) {
				return;
			}
			const now = new Date().getTime();
			const difference = nextDeadline - now;
			setDifference(difference);
			if (difference >= 0) {
				animationFrameRef.current = requestAnimationFrame(frameHandler);
				return;
			}
			if (!hasPicked || userInput !== letter) {
				miss();
			}
			randomLetter();
			setNextDeadline(new Date().getTime() + difficultyTiming);
		}
		let timeout: number | undefined;
		if (isFirstRound) {
			timeout = window.setTimeout(() => {
				randomLetter();
				animationFrameRef.current = requestAnimationFrame(frameHandler);
			}, difficultyTiming);
			setIsFirstRound(false);
			return;
		}
		animationFrameRef.current = requestAnimationFrame(frameHandler);
		return () => {
			clearTimeout(timeout);
			if (!animationFrameRef.current) {
				return;
			}
			cancelAnimationFrame(animationFrameRef.current);
		};
	}, [nextDeadline, difficultyTiming, randomLetter, userInput, hasPicked, miss, letter, isGameOver, isFirstRound]);

	useEffect(() => {
		return () => {
			if (!animationFrameRef.current) {
				return;
			}
			cancelAnimationFrame(animationFrameRef.current);
		};
	}, []);

	if (isGameOver) {
		return (
			<div>
				<Heading size="3xl" textStyle="stroke" textAlign="center" mb={4}>
					Game over
				</Heading>
				<SolidButton onClick={reset} autoFocus>
					Play again
				</SolidButton>
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
			<Heading>{difference}</Heading>
			<Keyboard />
		</Flex>
	);
}
