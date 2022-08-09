import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import Keyboard from "../../components/Keyboard";
import useGameContext from "../../hooks/useGameContext";
import SolidButton from "../FloatingText/SolidButton";

export default function Game() {
	const { score, letter, isGameOver, userInput, miss, lives, reset, nextDeadline, hit, nextRound } = useGameContext();
	const animationFrameRef = useRef<number | undefined>();

	useEffect(() => {
		function frameHandler() {
			if (isGameOver) {
				return;
			}
			if (letter === null) {
				nextRound();
				return;
			}
			if (userInput) {
				userInput === letter ? hit() : miss();
				return;
			}
			if (nextDeadline - new Date().getTime() >= 0) {
				animationFrameRef.current = requestAnimationFrame(frameHandler);
				return;
			}
			miss();
		}
		animationFrameRef.current = requestAnimationFrame(frameHandler);
		return () => {
			if (animationFrameRef.current === undefined) {
				return;
			}
			cancelAnimationFrame(animationFrameRef.current);
		};
	}, [userInput, miss, isGameOver, nextDeadline, letter, hit, nextRound]);

	useEffect(() => {
		return () => {
			if (animationFrameRef.current === undefined) {
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
			<Keyboard />
		</Flex>
	);
}
