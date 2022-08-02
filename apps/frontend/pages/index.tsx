import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { alphabet } from "../common/constants";
import Keyboard from "../components/Keyboard";
import useLetterContext from "../hooks/useLetterContext";

enum DifficultyTiming {
	EASY = 1000,
	MEDIUM = 500,
	HARD = 250,
}

export default function Index() {
	const { letter, setIsLocked, setLetter } = useLetterContext();
	const [difficultyTiming, setDifficultyTiming] = useState<DifficultyTiming>(DifficultyTiming.EASY);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (!isPlaying) {
			return;
		}
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
	}, [difficultyTiming, isPlaying, setIsLocked, setLetter]);

	useEffect(() => {
		if (!isPlaying) {
			return;
		}
		// hidden logic
	}, [isPlaying, letter, difficultyTiming]);

	return (
		<Flex h="100vh" justifyContent="center" alignItems="center">
			<Box pos="fixed" top={4} left={4}>
				{!isPlaying && <button onClick={() => setIsPlaying(true)}>play</button>}
				{isPlaying && <button onClick={() => setIsPlaying(false)}>stop</button>}
			</Box>
			<Flex flexDir="column" gap={10}>
				<h1>{letter ?? "..."}</h1>
				<Keyboard />
			</Flex>
		</Flex>
	);
}
