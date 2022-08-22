import { Box, Flex, keyframes, Text } from "@chakra-ui/react";
import { Difficulty, difficultyInMs } from "@shared";
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

const shakeAnimation = [
	"translate(5px, 5px) rotate(5deg)",
	"translate(0px, 0px) rotate(0deg)",
	"translate(-5px, 5px) rotate(-5deg)",
	"translate(0px, 0px) rotate(0deg)",
];

function getShakeAnimation(difficulty: Difficulty) {
	switch (difficulty) {
		case "easy":
			return shakeAnimation;
		case "medium":
			return [...shakeAnimation, ...shakeAnimation];
		case "hard":
			return [...shakeAnimation, ...shakeAnimation, ...shakeAnimation];
	}
}

export default function Key({ symbol }: Props) {
	const { query } = useRouter();
	const { socket, room, player } = useWebsocketContext();
	const { playAudio } = useSoundContext();
	const [isPressed, setIsPressed] = useState(false);
	const isActive = useMemo(() => room?.letter === symbol, [room, symbol]);
	const { borderColor, growingColor, textColor } = useMemo(() => {
		let growingColor = "";
		let borderColor = "";
		let textColor = "";
		switch (room?.difficulty) {
			case "easy":
				growingColor = "green.600";
				borderColor = "green.500";
				textColor = "green.100";
				break;
			case "medium":
				growingColor = "yellow.600";
				borderColor = "yellow.500";
				textColor = "yellow.100";
				break;
			case "hard":
				growingColor = "red.600";
				borderColor = "red.500";
				textColor = "red.100";
				break;
		}
		return {
			textColor: isActive ? textColor : undefined,
			growingColor,
			borderColor: room?.letter === symbol ? borderColor : undefined,
		};
	}, [room?.difficulty, room?.letter, symbol, isActive]);
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
			animate={isActive ? { transform: getShakeAnimation(room.difficulty) } : undefined}
		>
			<Flex
				justifyContent="center"
				alignItems="center"
				w={100}
				h={100}
				bgColor={bgColor}
				borderColor={borderColor}
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
						h="140%"
						w="140%"
					/>
				)}
				<Text
					textTransform="uppercase"
					fontWeight="bold"
					fontFamily="Inter"
					fontSize="4xl"
					userSelect="none"
					color={textColor}
					zIndex={10}
				>
					{symbol}
				</Text>
			</Flex>
		</Flex>
	);
}
