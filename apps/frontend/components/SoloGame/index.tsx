import { Button, Flex, FormControl, Grid, Heading, Icon, Input } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import { useMenu, useSoloGameContext } from "../../hooks";
import { Heart } from "@styled-icons/evaicons-solid";
import { Menu } from "../Menu";
import { CheckmarkCircle2Outline } from "@styled-icons/evaicons-outline";
import { useForm } from "react-hook-form";
import { Highscore, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "@shared";

interface SubmitFields {
	name: string;
}

export default function SoloGame() {
	const {
		score,
		letter,
		isGameOver,
		userInput,
		miss,
		lives,
		reset,
		nextDeadline,
		hit,
		nextRound,
		setTimeLeft,
		difficulty,
	} = useSoloGameContext();
	const animationFrameRef = useRef<number | undefined>();
	const navigate = useMenu();
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const { handleSubmit, register, formState } = useForm<SubmitFields>({ defaultValues: { name: "" } });

	const submit = useCallback(
		async ({ name }: SubmitFields) => {
			if (hasSubmitted) {
				return;
			}
			const { ok } = await fetch(`${process.env.NX_API_ENDPOINT}/leaderboard`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					difficulty,
					score,
				} as Highscore),
			});
			if (ok) {
				setHasSubmitted(true);
				return;
			}
		},
		[difficulty, score, hasSubmitted]
	);

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
				<Flex gap={2} justifyContent="center" flexDir="column" px={4} py={12}>
					<Heading size="2xl">Score: {score}</Heading>
					<FormControl
						display="flex"
						justifyContent="center"
						as="form"
						p={4}
						gap={2}
						onSubmit={handleSubmit(submit)}
					>
						<Input
							{...register("name", {
								required: {
									message: "Please enter a name",
									value: true,
								},
								maxLength: {
									message: "Max 15 characters",
									value: NAME_MAX_LENGTH,
								},
								minLength: {
									message: "Minimum 3 characters",
									value: NAME_MIN_LENGTH,
								},
							})}
							required
							borderWidth={3}
							borderColor="blue.900"
							w="50%"
							variant="filled"
							colorScheme="blue"
							placeholder="Name"
							autoFocus
							_hover={{}}
							_focusVisible={{}}
						/>
						<Button
							type="submit"
							disabled={hasSubmitted || formState.isSubmitting}
							isLoading={formState.isSubmitting}
						>
							Submit
							{hasSubmitted && <Icon w={6} h={6} ml={1} as={CheckmarkCircle2Outline} />}
						</Button>
					</FormControl>
				</Flex>
				<Flex p={4} justifyContent="space-between" bgColor="gray.100" borderTop="inherit">
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
