import { Box, Flex, Text } from "@chakra-ui/react";
import useGameContext from "apps/frontend/hooks/useGameContext";
import useSoundContext from "apps/frontend/hooks/useSoundContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Props {
	symbol: string;
}

export default function Key({ symbol }: Props) {
	const { letter, hasPicked, isPlaying, difficultyTiming, pick, timeLeft } = useGameContext();
	const { playAudio } = useSoundContext();
	const [isPressed, setIsPressed] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const isActive = useMemo(() => letter === symbol, [letter, symbol]);
	const errorRef = useRef<number | undefined>();
	const successRef = useRef<number | undefined>();
	const percentLeft = useMemo(
		() => (isActive ? timeLeft / difficultyTiming : 1),
		[isActive, difficultyTiming, timeLeft]
	);

	const error = useCallback(() => {
		setIsError(true);
		errorRef.current = window.setTimeout(() => {
			setIsError(false);
		}, difficultyTiming);
	}, [difficultyTiming]);

	const success = useCallback(() => {
		setIsSuccess(true);
		successRef.current = window.setTimeout(() => {
			setIsSuccess(false);
		}, difficultyTiming);
	}, [difficultyTiming]);

	useEffect(() => {
		return () => {
			clearTimeout(errorRef.current);
			clearTimeout(successRef.current);
		};
	}, []);

	useEffect(() => {
		setIsError(false);
		setIsSuccess(false);
		clearTimeout(errorRef.current);
		clearTimeout(successRef.current);
	}, [letter]);

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
			if (key === letter) {
				success();
			} else {
				error();
			}
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
	}, [symbol, letter, isPressed, playAudio, isPlaying, success, error, hasPicked, pick]);

	function color() {
		if (isError || isSuccess) {
			return "gray.100";
		}
		return isActive ? "gray.100" : "blue.700";
	}

	function bgColor() {
		if (isError) {
			return "red.500";
		}
		if (isSuccess) {
			return "green.500";
		}
		if (isActive) {
			return "blue.300";
		}
		return isPressed ? "whiteAlpha.800" : "whiteAlpha.900";
	}

	function borderColor() {
		if (isError || isSuccess || !isActive) {
			return "blackAlpha.300";
		}
		return "blue.200";
	}

	return (
		<Flex
			justifyContent="center"
			alignItems="center"
			w={100}
			h={100}
			bgColor={bgColor()}
			borderWidth={4}
			borderColor={borderColor()}
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
					bgColor="red.500"
					h="full"
					w="full"
				/>
			)}
			<Text
				textTransform="uppercase"
				fontWeight="bold"
				fontSize="4xl"
				userSelect="none"
				color={color()}
				zIndex={10}
			>
				{symbol}
			</Text>
		</Flex>
	);
}
