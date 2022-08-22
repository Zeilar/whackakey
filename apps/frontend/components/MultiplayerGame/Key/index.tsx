import { Box, Flex, keyframes, Text } from "@chakra-ui/react";
import { difficultyInMs } from "@shared";
import { useSoundContext, useWebsocketContext } from "apps/frontend/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

interface Props {
	symbol: string;
}

const animation = keyframes`
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
`;

export default function Key({ symbol }: Props) {
	const { query } = useRouter();
	const { socket, room, player } = useWebsocketContext();
	const { playAudio } = useSoundContext();
	const [isPressed, setIsPressed] = useState(false);
	const isActive = useMemo(() => room?.letter === symbol, [room, symbol]);
	const growingColor = useMemo(() => {
		switch (room?.difficulty) {
			case "easy":
				return "green.500";
			case "medium":
				return "yellow.500";
			case "hard":
				return "red.500";
			default:
				return "green.500";
		}
	}, [room?.difficulty]);
	const bgColor = useMemo(() => {
		if (player?.pick == null || player.pick !== symbol || !room?.letter) {
			return "gray.100";
		}
		return player.pick === room.letter ? "green.500" : "red.500";
	}, [player?.pick, symbol, room?.letter]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (!room || !socket || !player || player.isEliminated) {
				return;
			}
			const { key } = e;
			if (key !== symbol || isPressed) {
				return;
			}
			setIsPressed(true);
			if (typeof player.pick === "string") {
				playAudio("click");
				return;
			}
			socket.emit("player-pick", { roomId: query.roomId, letter: key });
		}

		function onKeyUp(e: KeyboardEvent) {
			if (e.key !== symbol) {
				return;
			}
			setIsPressed(false);
		}

		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("keyup", onKeyUp);
		};
	}, [room, socket, player, symbol, isPressed, playAudio, query.roomId]);

	if (!room) {
		return null;
	}

	return (
		<Flex
			key={String(isActive)}
			as={motion.div}
			animate={
				isActive
					? {
							transform: [
								"translate(5px, 5px) rotate(5deg)",
								"translate(0px, 0px) rotate(0deg)",
								"translate(-5px, 5px) rotate(-5deg)",
								"translate(0px, 0px) rotate(0deg)",
								"translate(5px, 5px) rotate(5deg)",
								"translate(0px, 0px) rotate(0deg)",
								"translate(-5px, 5px) rotate(-5deg)",
								"translate(0px, 0px) rotate(0deg)",
							],
					  }
					: undefined
			}
		>
			<Flex
				justifyContent="center"
				alignItems="center"
				w={100}
				h={100}
				bgColor={bgColor}
				borderColor={isActive ? "blue.900" : "blackAlpha.300"}
				borderWidth={4}
				rounded="xl"
				pos="relative"
				boxShadow="md"
				overflow="hidden"
			>
				{isActive && (
					<Box
						animation={`${animation} ${difficultyInMs(room?.difficulty)}ms`}
						pos="absolute"
						zIndex={5}
						rounded="full"
						bgColor={growingColor}
						h="135%"
						w="135%"
					/>
				)}
				<Text
					textTransform="uppercase"
					fontWeight="bold"
					fontFamily="Inter"
					fontSize="4xl"
					userSelect="none"
					color={isActive ? "gray.100" : "blue.700"}
					zIndex={10}
				>
					{symbol}
				</Text>
			</Flex>
		</Flex>
	);
}
