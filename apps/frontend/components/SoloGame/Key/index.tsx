import { Box, Flex, keyframes, Text } from "@chakra-ui/react";
import { Difficulty, difficultyInMs } from "@shared";
import { useSoloGameContext, useSoundContext } from "apps/frontend/hooks";
import { motion } from "framer-motion";
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
	const { letter, userInput, pick, difficulty } = useSoloGameContext();
	const { playAudio } = useSoundContext();
	const [isPressed, setIsPressed] = useState(false);
	const isActive = useMemo(() => letter === symbol || userInput === symbol, [letter, symbol, userInput]);
	const { borderColor, bgColor } = useMemo(() => {
		return userInput === symbol
			? {
					borderColor: userInput === letter ? "green.300" : "red.300",
					bgColor: userInput === letter ? "green.500" : "red.500",
			  }
			: {
					bgColor: "gray.100",
					borderColor: "gray.300",
			  };
	}, [userInput, letter, symbol]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			const { key } = e;
			if (key !== symbol || isPressed || userInput != null) {
				return;
			}
			setIsPressed(true);
			if (typeof userInput === "string") {
				playAudio("click");
				return;
			}
			pick(symbol);
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
	}, [isPressed, pick, playAudio, symbol, userInput]);

	return (
		<motion.div
			key={String(isActive)}
			transition={{ duration: difficultyInMs(difficulty) / 1000 }}
			animate={letter === symbol ? { transform: getShakeAnimation(difficulty) } : undefined}
		>
			<Flex
				justifyContent="center"
				alignItems="center"
				opacity={isActive ? 1 : 0.35}
				w={100}
				h={100}
				color={isActive || userInput === symbol ? "gray.100" : undefined}
				bgColor={bgColor}
				borderColor={borderColor}
				borderWidth={4}
				rounded="xl"
				pos="relative"
				boxShadow="md"
				overflow="hidden"
			>
				{isActive && (
					<>
						<Box
							animation={`${animation} ${difficultyInMs(difficulty)}ms`}
							pos="absolute"
							zIndex={5}
							rounded="full"
							bgColor={userInput === symbol ? bgColor : "blue.700"}
							h="140%"
							w="140%"
						/>
					</>
				)}
				<Text
					textTransform="uppercase"
					fontWeight="bold"
					fontFamily="Inter"
					fontSize="4xl"
					userSelect="none"
					color={isActive ? "gray.100" : undefined}
					zIndex={10}
				>
					{symbol}
				</Text>
			</Flex>
		</motion.div>
	);
}
