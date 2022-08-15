import { Flex, Heading } from "@chakra-ui/react";
import { useWebsocketContext } from "apps/frontend/hooks";
import Key from "../Key";

const rows = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["z", "x", "c", "v", "b", "n", "m"],
];

export default function Keyboard() {
	const { player } = useWebsocketContext();

	if (!player) {
		return null;
	}

	return (
		<Flex pos="relative">
			{player.isEliminated && (
				<Flex
					pos="absolute"
					inset={0}
					w="100%"
					h="100%"
					zIndex={1000}
					justifyContent="center"
					alignItems="center"
				>
					<Heading color="red.500" size="4xl" textStyle="stroke" fontWeight={500} userSelect="none">
						K.O
					</Heading>
				</Flex>
			)}
			<Flex display="inline-flex" flexDir="column" gap={4} opacity={player.isEliminated ? 0.15 : 1}>
				<Flex pl={8} gap={4}>
					{rows[0].map(key => (
						<Key symbol={key} key={key} />
					))}
				</Flex>
				<Flex pl={14} gap={4}>
					{rows[1].map(key => (
						<Key symbol={key} key={key} />
					))}
				</Flex>
				<Flex pl={24} gap={4}>
					{rows[2].map(key => (
						<Key symbol={key} key={key} />
					))}
				</Flex>
			</Flex>
		</Flex>
	);
}
