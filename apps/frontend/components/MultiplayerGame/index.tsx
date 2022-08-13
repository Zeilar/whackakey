import { Flex, Heading } from "@chakra-ui/react";
import { useSoundContext, useWebsocketContext } from "apps/frontend/hooks";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Keyboard from "./Keyboard";

interface Props {
	timestamp: number;
}

export default function MultiplayerGame({ timestamp }: Props) {
	const { query } = useRouter();
	const { socket, rooms } = useWebsocketContext();
	const { playAudio } = useSoundContext();
	const room = useMemo(() => rooms.find(room => room.id === query.roomId), [rooms, query.roomId]);
	const player = useMemo(() => room?.players.find(player => player.id === socket?.id), [room, socket]);
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
			<Heading>{countdown}</Heading>
			<Keyboard />
			<Flex as="pre" bgColor="gray.100">
				{JSON.stringify(room?.players, null, 4)}
			</Flex>
		</Flex>
	);
}
