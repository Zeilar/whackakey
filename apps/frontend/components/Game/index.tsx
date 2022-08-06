import { Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { alphabet } from "../../common/constants";
import Keyboard from "../../components/Keyboard";
import useGameContext from "../../hooks/useGameContext";

export default function Game() {
	const { score, letter, setIsLocked, setLetter, difficultyTiming } = useGameContext();

	useEffect(() => {
		let timeout: number;
		const interval = window.setInterval(() => {
			setLetter(alphabet[Math.floor(Math.random() * alphabet.length)]);
			setIsLocked(false);
			const timeoutId = window.setTimeout(() => {
				setLetter(null);
			}, difficultyTiming);
			timeout = timeoutId;
		}, difficultyTiming * 2);
		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [difficultyTiming, setIsLocked, setLetter]);

	return (
		<Flex flexDir="column" gap={10} justifyContent="center" alignItems="center">
			<Heading>{score}</Heading>
			<h1>{letter ?? "..."}</h1>
			<Keyboard />
		</Flex>
	);
}
