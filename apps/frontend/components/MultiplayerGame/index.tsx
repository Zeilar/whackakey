import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { Difficulty } from "@shared";
import { Heart } from "@styled-icons/evaicons-solid";
import { useSoundContext, useWebsocketContext } from "apps/frontend/hooks";
import { useEffect, useState } from "react";
import Countdown from "../Countdown";
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
		if (!room?.isGameActive || player?.pick == null) {
			return;
		}
		playAudio(player.pick === room.letter ? "hit" : "hurt");
	}, [player?.pick, room?.isGameActive, room?.letter, playAudio]);

	useEffect(() => {
		if (typeof player?.pick === "string" || player?.lives === room?.lives) {
			return;
		}
		playAudio("hurt");
	}, [playAudio, room?.letter, player?.pick, player?.lives, room?.lives]);

	useEffect(() => {
		return () => {
			stopAll();
		};
	}, [stopAll]);

	if (!room || !player) {
		return null;
	}

	if (typeof countdown === "number") {
		return <Countdown countdown={countdown} />;
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
			<Flex gap={4} p={2} justifyContent="space-between">
				<Flex flexDir="column" gap={2}>
					{room.players.map(element => (
						<Flex key={element.id} gap={1} order={!isMe(element.id) ? 1 : undefined}>
							<Flex
								key={element.id}
								rounded="lg"
								borderWidth={3}
								borderColor={isMe(element.id) ? "cyan.700" : "blue.900"}
								color={isMe(element.id) ? "cyan.700" : "blue.900"}
								py={2}
								px={4}
								justifyContent="space-between"
								alignItems="center"
								bgColor="gray.100"
								boxShadow="lg"
							>
								<Text
									fontSize="lg"
									mr={4}
									w={250}
									textOverflow="ellipsis"
									whiteSpace="nowrap"
									overflow="hidden"
								>
									{element.name}
								</Text>
							</Flex>
							<Flex
								px={4}
								bgColor={isMe(element.id) ? "cyan.600" : "blue.700"}
								color="gray.100"
								gap={1}
								alignItems="center"
								rounded="lg"
								borderWidth={3}
								borderColor="blue.900"
							>
								{element.lives > 0 ? (
									Array(element.lives)
										.fill(null)
										.map((_, i) => (
											<Icon
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
