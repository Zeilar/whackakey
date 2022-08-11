import { Flex } from "@chakra-ui/react";
import Game from "../components/Game";
import Latency from "../components/Latency";
import Menu from "../components/Menu";
import SoundToggler from "../components/SoundToggler";
import useGameContext from "../hooks/useGameContext";

export default function Index() {
	const { isPlaying } = useGameContext();
	return (
		<Flex justifyContent="center" alignItems="center">
			{isPlaying ? <Game /> : <Menu />}
			<SoundToggler />
			<Latency />
		</Flex>
	);
}
