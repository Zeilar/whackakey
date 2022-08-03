import { Flex } from "@chakra-ui/react";
import Key from "../Key";

const rows = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["z", "x", "c", "v", "b", "n", "m"],
];

export default function Keyboard() {
	return (
		<Flex display="inline-flex" flexDir="column" gap={4}>
			<Flex pl={8} gap={2}>
				{rows[0].map(key => (
					<Key symbol={key} key={key} />
				))}
			</Flex>
			<Flex pl={14} gap={2}>
				{rows[1].map(key => (
					<Key symbol={key} key={key} />
				))}
			</Flex>
			<Flex pl={24} gap={2}>
				{rows[2].map(key => (
					<Key symbol={key} key={key} />
				))}
			</Flex>
		</Flex>
	);
}
