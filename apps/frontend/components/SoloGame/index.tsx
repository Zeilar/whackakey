import { Button, Flex, FormControl, FormLabel, Grid, Heading, Icon, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import { useMenu, useSoloGameContext } from "../../hooks";
import { Heart } from "@styled-icons/evaicons-solid";
import { Menu } from "../Menu";
import { CheckmarkCircle2Outline } from "@styled-icons/evaicons-outline";

export default function SoloGame() {
	const { score, letter, isGameOver, userInput, miss, lives, reset, nextDeadline, hit, nextRound, setTimeLeft } =
		useSoloGameContext();
	const animationFrameRef = useRef<number | undefined>();
	const navigate = useMenu();
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

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

	useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	function resetAndNavigate(menu: Menu) {
		return () => {
			reset();
			navigate(menu)();
		};
	}

	if (isGameOver) {
		return (
			<Flex
				textAlign="center"
				bgColor="gray.300"
				rounded="xl"
				borderWidth={4}
				borderColor="blue.900"
				flexDir="column"
				overflow="hidden"
				w={600}
			>
				<Heading size="3xl" borderBottom="inherit" bgColor="blue.700" textStyle="stroke" p={4}>
					Game over
				</Heading>
				<Heading size="2xl">Score: {score}</Heading>
				<FormControl as="form" p={4}>
					<FormLabel w="fit-content">Name</FormLabel>
					<Flex>
						<Input variant="filled" colorScheme="blue" placeholder="John Doe" autoFocus />
						<Button type="submit" disabled={hasSubmitted || isSubmitting}>
							Submit
							{hasSubmitted && <Icon w={6} h={6} ml={1} as={CheckmarkCircle2Outline} />}
						</Button>
					</Flex>
				</FormControl>
				<Flex p={4} justifyContent="space-between" bgColor="gray.100">
					<Button onClick={resetAndNavigate("main")} size="lg">
						Main menu
					</Button>
					<Button onClick={resetAndNavigate("solo")} size="lg">
						Play again
					</Button>
				</Flex>
			</Flex>
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
					bgColor={"cyan.600"}
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
