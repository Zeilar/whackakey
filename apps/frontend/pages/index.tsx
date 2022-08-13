import { Flex } from "@chakra-ui/react";
import SoloGame from "../components/SoloGame";
import Menu from "../components/Menu";
import { useSoloGameContext } from "../hooks/";

export default function Index() {
	const { isPlaying } = useSoloGameContext();
	return (
		<Flex justifyContent="center" alignItems="center">
			{isPlaying ? <SoloGame /> : <Menu />}
		</Flex>
	);
}
