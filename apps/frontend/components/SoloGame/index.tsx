import { Flex, Grid, Heading, Icon } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import Keyboard from "./Keyboard";
import { useSoloGameContext } from "../../hooks";
import SolidButton from "../SolidButton";
import { Heart } from "@styled-icons/evaicons-solid";

export default function SoloGame() {
	const { score, letter, isGameOver, userInput, miss, lives, reset, nextDeadline, hit, nextRound, setTimeLeft } =
		useSoloGameContext();
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
			const timeLeft = nextDeadline - new Date().getTime();
			if (timeLeft >= 0) {
				animationFrameRef.current = requestAnimationFrame(frameHandler);
				setTimeLeft(timeLeft);
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
	}, [userInput, miss, isGameOver, nextDeadline, letter, hit, nextRound, setTimeLeft]);

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
		<Flex
			flexDir="column"
			userSelect="none"
			borderWidth={4}
			borderColor="blue.900"
			rounded="xl"
			boxShadow="lg"
			overflow="hidden"
			p={4}
			gap={4}
			bgColor="gray.300"
		>
			<Grid gridTemplateColumns="1fr 1fr" gridGap={20} alignItems="center">
				<Flex
					justifySelf="flex-end"
					px={4}
					py={2}
					bgColor={"yellow.500"}
					color="gray.100"
					gap={1}
					alignItems="center"
					rounded="lg"
					borderWidth={3}
					borderColor="blue.900"
				>
					{Array(lives)
						.fill(null)
						.map((_, i) => (
							<Icon color="red.500" strokeWidth={3} stroke="blue.900" w={8} h={8} as={Heart} key={i} />
						))}
				</Flex>
				<Heading letterSpacing={4} size="4xl" textStyle="stroke">
					{score}
				</Heading>
			</Grid>
			<Keyboard />
		</Flex>
	);
}
