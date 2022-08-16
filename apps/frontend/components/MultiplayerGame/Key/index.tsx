import { Box, Flex, keyframes, Text } from "@chakra-ui/react";
import { difficultyInMs } from "@shared";
import { useSoundContext, useWebsocketContext } from "apps/frontend/hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

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

	const bgColor = useCallback(() => {
		if (isActive) {
			return "blue.300";
		}
		return isPressed ? "whiteAlpha.800" : "whiteAlpha.900";
	}, [isActive, isPressed]);

	return (
		<Flex
			justifyContent="center"
			alignItems="center"
			w={100}
			h={100}
			bgColor={bgColor()}
			borderColor={isActive ? "blue.200" : "blackAlpha.300"}
			borderWidth={4}
			rounded="xl"
			pos="relative"
			boxShadow="var(--chakra-shadows-lg), 0 0 5px 0 inset rgba(0, 0, 0, 0.1)"
		>
			{isActive && (
				<Box
					animation={`${animation} ${difficultyInMs("easy")}ms`}
					overflow="hidden"
					rounded="inherit"
					pos="absolute"
					top={0}
					left={0}
					zIndex={5}
					bgColor="blue.900"
					h="full"
					w="full"
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
	);
}
