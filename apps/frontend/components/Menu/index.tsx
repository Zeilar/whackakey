import { Button, Flex, Heading, Link } from "@chakra-ui/react";
import useGameContext from "apps/frontend/hooks/useGameContext";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import DifficultyItem from "./DifficultyItem";

export default function Menu() {
	const { play, setDifficultyTiming } = useGameContext();
	const [isCountingDown, setIsCountingDown] = useState(false);
	const [countdown, setCountdown] = useState(3);

	useEffect(() => {
		if (!isCountingDown) {
			return;
		}
		if (countdown <= 0) {
			play();
			return;
		}
		const timeout = window.setTimeout(() => {
			setCountdown(p => p - 1);
		}, 1000);
		return () => {
			clearTimeout(timeout);
		};
	}, [countdown, play, isCountingDown]);

	function countdownColor() {
		if (countdown === 3) {
			return "red.500";
		}
		if (countdown === 2) {
			return "yellow.500";
		}
		if (countdown === 1) {
			return "green.500";
		}
	}

	if (isCountingDown) {
		return countdown > 0 ? (
			<Heading
				userSelect="none"
				fontSize="10rem"
				sx={{ WebkitTextStrokeWidth: 1, WebkitTextStrokeColor: "var(--chakra-colors-blackAlpha-900)" }}
				color={countdownColor()}
			>
				{countdown}
			</Heading>
		) : null;
	}

	return (
		<Flex as="nav" gap={4} flexDir="column" width={500}>
			<Button variant="key" size="xl" onClick={() => setIsCountingDown(true)}>
				Play
			</Button>
			<DifficultyItem onChange={setDifficultyTiming} />
			<NextLink passHref href="/tutorial">
				<Button variant="key" size="xl" as={Link} _hover={{ textDecor: "none" }}>
					How to play
				</Button>
			</NextLink>
		</Flex>
	);
}
