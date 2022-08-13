import { Box, Flex, Text } from "@chakra-ui/react";
import { useSoundContext, useSoloGameContext } from "apps/frontend/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
	symbol: string;
}

export default function Key({ symbol }: Props) {
	const { letter, hasPicked, isPlaying, difficultyTiming, pick, timeLeft } = useSoloGameContext();
	const { playAudio } = useSoundContext();
	const [isPressed, setIsPressed] = useState(false);
	const isActive = useMemo(() => letter === symbol, [letter, symbol]);
	const percentLeft = useMemo(
		() => (isActive ? timeLeft / difficultyTiming : 1),
		[isActive, difficultyTiming, timeLeft]
	);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			const { key } = e;
			if (key !== symbol || isPressed || !isPlaying) {
				return;
			}
			setIsPressed(true);
			if (hasPicked) {
				playAudio("click");
				return;
			}
			pick(key);
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
	}, [symbol, letter, isPressed, playAudio, isPlaying, hasPicked, pick]);

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
					rounded="inherit"
					pos="absolute"
					top={0}
					left={0}
					zIndex={5}
					transform={`scale(${1 - percentLeft})`}
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
