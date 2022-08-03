import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { alphabet } from "../common/constants";
import Keyboard from "../components/Keyboard";
import SoundToggler from "../components/SoundToggler";
import useLetterContext from "../hooks/useLetterContext";
import useScoreContext from "../hooks/useScoreContext";
import { DifficultyTiming } from "../types/game";

export default function Index() {
	const { letter, setIsLocked, setLetter } = useLetterContext();
	const { score } = useScoreContext();
	const [difficultyTiming, setDifficultyTiming] = useState<DifficultyTiming>(DifficultyTiming.HARD);
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
		<Flex
			h="100vh"
			justifyContent="center"
			alignItems="center"
			bgColor="#245195"
			bgSize="80px 80px"
			bgPos="0 0, 40px 40px"
			bgImage="radial-gradient(#18335c 2px, transparent 2px), radial-gradient(#18335c 2px, #245195 2px)"
		>
			<Box pos="fixed" top={4} left={4}>
				{!isPlaying && <button onClick={() => setIsPlaying(true)}>play</button>}
				{isPlaying && <button onClick={() => setIsPlaying(false)}>stop</button>}
			</Box>
			<Flex flexDir="column" gap={10} justifyContent="center" alignItems="center">
				<h1>{score}</h1>
				<h1>{letter ?? "..."}</h1>
				<Keyboard />
			</Flex>
			<SoundToggler />
		</Flex>
	);
}
