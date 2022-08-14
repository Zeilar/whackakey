import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { Heart } from "@styled-icons/evaicons-solid";
import { DEFAULT_LIVES } from "apps/frontend/common/constants";
import { useSoundContext, useWebsocketContext } from "apps/frontend/hooks";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Keyboard from "./Keyboard";

interface Props {
	timestamp: number;
}

export default function MultiplayerGame({ timestamp }: Props) {
	const { query } = useRouter();
	const { socket, rooms, room, player } = useWebsocketContext();
	const { playAudio } = useSoundContext();
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

	return (
		<Flex flexDir="column">
			<Flex>
				{room?.players.map(element =>
					element.id !== player?.id ? (
						<Flex key={element.id} flexDir="column" alignItems="flex-start">
							<Flex
								gap={0}
								ml={2}
								px={2}
								py={1}
								mb="-2px"
								bgColor="blue.900"
								color="gray.100"
								roundedTop="lg"
								borderWidth={2}
								borderColor="gray.100"
							>
								{Array(DEFAULT_LIVES)
									.fill(null)
									.map((_, i) => (
										<Icon
											opacity={i < element.lives ? 1 : 0}
											color="red.400"
											w={8}
											h={8}
											as={Heart}
											key={i}
										/>
									))}
							</Flex>
							<Flex
								px={4}
								py={2}
								justifyContent="space-between"
								alignItems="center"
								bgColor="blue.900"
								color="gray.100"
								rounded="lg"
								borderWidth={2}
								borderColor="gray.100"
								boxShadow="lg"
							>
								<Text mr={4}>{element.name}</Text>
								<Flex alignItems="center">
									<Button variant="key" as="div">
										{element.pick ?? "?"}
									</Button>
								</Flex>
							</Flex>
						</Flex>
					) : null
				)}
			</Flex>
			<Heading>{countdown}</Heading>
			<Keyboard />
		</Flex>
	);
}
