import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { Difficulty } from "@shared";
import { Heart } from "@styled-icons/evaicons-solid";
import { useSoundContext, useWebsocketContext } from "apps/frontend/hooks";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Keyboard from "./Keyboard";

interface Props {
	timestamp: number;
}

export default function MultiplayerGame({ timestamp }: Props) {
	const { room, player, isMe } = useWebsocketContext();
	const { playAudio, stopAll } = useSoundContext();
	const [countdown, setCountdown] = useState<number | null>(null);

	useEffect(() => {
		if (typeof timestamp !== "number") {
			return;
		}
		let animationFrame: number;
		function frameHandler() {
			if (typeof timestamp !== "number" || !room) {
				return;
			}
			if (Date.now() >= timestamp) {
				setCountdown(null);
				playAudio(`level-${room.difficulty}`);
				return;
			}
			setCountdown(Math.ceil((timestamp - Date.now()) / 1000));
			animationFrame = requestAnimationFrame(frameHandler);
		}
		animationFrame = requestAnimationFrame(frameHandler);
		return () => {
			cancelAnimationFrame(animationFrame);
		};
	}, [timestamp, playAudio, room]);

	useEffect(() => {
		if (!room?.difficulty) {
			return;
		}
		if (!room.isGameActive) {
			stopAll();
			return;
		}
		playAudio(`level-${room.difficulty}`);
		return () => {
			stopAll();
		};
	}, [room?.difficulty, stopAll, playAudio, room?.isGameActive]);

	useEffect(() => {
		return () => {
			stopAll();
		};
	}, [stopAll]);

	if (!room || !player) {
		return null;
	}

	function countdownColor() {
		switch (countdown) {
			case 3:
				return "red.500";
			case 2:
				return "yellow.500";
			case 1:
				return "green.500";
			default:
				return "gray.100";
		}
	}

	if (typeof countdown === "number") {
		return (
			<Box
				key={countdown}
				as={motion.div}
				transition="0.1s"
				initial={{ transform: "scale(5)", opacity: 0.5 }}
				animate={{ transform: "scale(2.5)", opacity: 1 }}
			>
				<Heading textStyle="stroke" size="4xl" color={countdownColor()} userSelect="none">
					{countdown}
				</Heading>
			</Box>
		);
	}

	function DifficultyBox({ difficulty }: { difficulty: Difficulty }) {
		let bgColor: string;
		switch (difficulty) {
			case "easy":
				bgColor = "green.500";
				break;
			case "medium":
				bgColor = "yellow.500";
				break;
			case "hard":
				bgColor = "red.500";
				break;
		}
		return (
			<Box
				py={4}
				px={8}
				fontSize="xl"
				textTransform="uppercase"
				bgColor={bgColor}
				pos="relative"
				_after={
					room?.difficulty !== difficulty
						? {
								content: `""`,
								pos: "absolute",
								inset: 0,
								w: "100%",
								h: "100%",
								bgColor: "blackAlpha.700",
						  }
						: undefined
				}
			>
				{difficulty}
			</Box>
		);
	}

	return (
		<Flex
			flexDir="column"
			borderWidth={4}
			borderColor="blue.900"
			rounded="xl"
			boxShadow="lg"
			overflow="hidden"
			p={4}
			gap={4}
			bgColor="gray.300"
		>
			<Flex gap={4} p={2} justifyContent="space-between">
				<Flex flexDir="column" gap={2}>
					{room.players.map(element => (
						<Flex key={element.id} gap={1} order={!isMe(element.id) ? 1 : undefined}>
							<Flex
								key={element.id}
								w={400}
								rounded="lg"
								borderWidth={3}
								borderColor={isMe(element.id) ? "yellow.600" : "blue.900"}
								color={isMe(element.id) ? "yellow.600" : "blue.900"}
								py={2}
								px={4}
								justifyContent="space-between"
								alignItems="center"
								bgColor="gray.100"
								boxShadow="lg"
							>
								<Text fontSize="lg" mr={4}>
									{element.name}
								</Text>
							</Flex>
							<Flex
								px={4}
								alignItems="center"
								bgColor={isMe(element.id) ? "yellow.500" : "blue.700"}
								color="gray.100"
								gap={1}
								rounded="lg"
								borderWidth={3}
								borderColor="blue.900"
							>
								{element.lives > 0 ? (
									Array(room.lives)
										.fill(null)
										.map((_, i) => (
											<Icon
												opacity={Number(i < element.lives)}
												color="red.500"
												strokeWidth={3}
												stroke="blue.900"
												w={8}
												h={8}
												as={Heart}
												key={i}
											/>
										))
								) : (
									<Heading color="red.500" size="lg">
										K.O
									</Heading>
								)}
							</Flex>
						</Flex>
					))}
				</Flex>
				<Flex
					borderWidth={3}
					borderColor="blue.900"
					color="gray.100"
					h="fit-content"
					rounded="lg"
					overflow="hidden"
					bgColor="blue.900"
				>
					<DifficultyBox difficulty="easy" />
					<DifficultyBox difficulty="medium" />
					<DifficultyBox difficulty="hard" />
				</Flex>
			</Flex>
			<Keyboard />
		</Flex>
	);
}
