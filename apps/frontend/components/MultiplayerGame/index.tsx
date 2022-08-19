import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { Heart } from "@styled-icons/evaicons-solid";
import { useSoundContext, useWebsocketContext } from "apps/frontend/hooks";
import { useEffect, useState } from "react";
import Keyboard from "./Keyboard";

interface Props {
	timestamp: number;
}

export default function MultiplayerGame({ timestamp }: Props) {
	const { room, player, isMe } = useWebsocketContext();
	const { playAudio, stopAudio } = useSoundContext();
	const [countdown, setCountdown] = useState<number>();

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
				setCountdown(undefined);
				playAudio(`level-${room.difficulty}`);
				return;
			}
			setCountdown(timestamp - Date.now());
			animationFrame = requestAnimationFrame(frameHandler);
		}
		animationFrame = requestAnimationFrame(frameHandler);
		return () => {
			cancelAnimationFrame(animationFrame);
		};
	}, [timestamp, playAudio, room]);

	useEffect(() => {
		if (!room?.difficulty || !room.isGameActive) {
			return;
		}
		playAudio(`level-${room.difficulty}`);
		return () => {
			stopAudio(`level-${room.difficulty}`);
		};
	}, [room?.difficulty, stopAudio, playAudio, room?.isGameActive]);

	if (!room || !player) {
		return null;
	}

	return (
		<Flex flexDir="column" alignItems="center">
			<Flex
				justifyContent="center"
				gap={2}
				flexDir="column"
				bgColor="gray.300"
				p={2}
				roundedTop="xl"
				borderWidth={4}
				borderBottomWidth={0}
				borderColor="blue.900"
			>
				{room.players.map(element => (
					<Flex key={element.id} gap={1} order={!isMe(element.id) ? 1 : undefined}>
						<Flex
							key={element.id}
							w="20rem"
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
											color={i < element.lives ? "red.500" : "whiteAlpha.300"}
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
			<Heading>{countdown}</Heading>
			<Box borderWidth={4} borderColor="blue.900" rounded="xl" boxShadow="lg" p={4} bgColor="gray.300">
				<Keyboard />
			</Box>
		</Flex>
	);
}
