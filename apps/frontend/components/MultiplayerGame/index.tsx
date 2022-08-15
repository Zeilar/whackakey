import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { Heart } from "@styled-icons/evaicons-solid";
import { DEFAULT_LIVES } from "apps/frontend/common/constants";
import { useWebsocketContext } from "apps/frontend/hooks";
import { useEffect, useState } from "react";
import Keyboard from "./Keyboard";

interface Props {
	timestamp: number;
}

export default function MultiplayerGame({ timestamp }: Props) {
	const { socket, room, player } = useWebsocketContext();
	const [countdown, setCountdown] = useState<number>();

	useEffect(() => {
		if (!socket) {
			return;
		}
	}, [socket]);

	useEffect(() => {
		if (typeof timestamp !== "number") {
			return;
		}
		let animationFrame: number;
		function frameHandler() {
			if (typeof timestamp !== "number") {
				return;
			}
			if (Date.now() >= timestamp) {
				setCountdown(undefined);
				return;
			}
			setCountdown(timestamp - Date.now());
			animationFrame = requestAnimationFrame(frameHandler);
		}
		animationFrame = requestAnimationFrame(frameHandler);
		return () => {
			cancelAnimationFrame(animationFrame);
		};
	}, [timestamp]);

	if (!room || !player) {
		return null;
	}

	console.log(room.isGameActive, room.letter);

	return (
		<Flex flexDir="column" gap={2}>
			<Flex justifyContent="center" gap={2}>
				{room.players.map(element => (
					<Flex key={element.id}>
						<Flex
							roundedLeft="lg"
							roundedRight={0}
							borderWidth={2}
							borderColor="gray.100"
							px={4}
							py={2}
							justifyContent="space-between"
							alignItems="center"
							bgColor="blue.900"
							color="gray.100"
							boxShadow="lg"
						>
							<Text textStyle="stroke" fontSize="lg" mr={4}>
								{element.name}
							</Text>
							<Button variant="key" as="div" w={4}>
								{element.pick ?? "?"}
							</Button>
						</Flex>
						<Flex
							px={4}
							ml="-2px"
							alignItems="center"
							bgColor="blue.900"
							color="gray.100"
							roundedRight="lg"
							borderWidth={2}
							borderColor="gray.100"
						>
							{element.lives > 0 ? (
								Array(DEFAULT_LIVES)
									.fill(null)
									.map((_, i) => (
										<Icon
											color={i < element.lives ? "red.400" : "whiteAlpha.300"}
											w={6}
											h={6}
											as={Heart}
											key={i}
										/>
									))
							) : (
								<Heading color="red.500" size="lg" fontWeight={500} textStyle="stroke">
									K.O
								</Heading>
							)}
						</Flex>
					</Flex>
				))}
			</Flex>
			<Heading>{countdown}</Heading>
			<Keyboard />
		</Flex>
	);
}
