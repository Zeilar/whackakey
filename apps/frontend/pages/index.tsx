import { Flex } from "@chakra-ui/react";
import SoloGame from "../components/SoloGame";
import Latency from "../components/Latency";
import Menu from "../components/Menu";
import SoundToggler from "../components/SoundToggler";
import { useGameContext } from "../hooks/";

export default function Index() {
	const { isPlaying } = useGameContext<"solo">("solo");
	return (
		<Flex justifyContent="center" alignItems="center">
			{isPlaying ? <SoloGame /> : <Menu />}
			<SoundToggler />
			<Latency />
		</Flex>
	);
}
