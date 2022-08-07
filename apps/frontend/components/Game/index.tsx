import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { alphabet } from "../../common/constants";
import Keyboard from "../../components/Keyboard";
import useGameContext from "../../hooks/useGameContext";

export default function Game() {
	const { score, setIsLocked, setLetter, difficultyTiming, isGameOver } = useGameContext();

	useEffect(() => {
		let timeout: number;
		const interval = window.setInterval(() => {
			if (isGameOver) {
				clearInterval(interval);
			}
			setLetter(alphabet[Math.floor(Math.random() * alphabet.length)]);
			setIsLocked(false);
			const timeoutId = window.setTimeout(() => {
				if (isGameOver) {
					clearTimeout(timeoutId);
				}
				setLetter(null);
			}, difficultyTiming);
			timeout = timeoutId;
		}, difficultyTiming * 2);
		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [difficultyTiming, setIsLocked, setLetter, isGameOver]);

	if (isGameOver) {
		return <Heading>Game over</Heading>;
	}

	return (
		<Flex flexDir="column" gap={10} justifyContent="center" alignItems="center">
			<Heading
				color="gray.100"
				letterSpacing={4}
				size="4xl"
				sx={{ WebkitTextStrokeWidth: 1, WebkitTextStrokeColor: "var(--chakra-colors-blue-300)" }}
			>
				{score}
			</Heading>
			<Keyboard />
		</Flex>
	);
}
