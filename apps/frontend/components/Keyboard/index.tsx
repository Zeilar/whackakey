import { Flex } from "@chakra-ui/react";
import Key from "../Key";

const rows = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["z", "x", "c", "v", "b", "n", "m"],
];

export default function Keyboard() {
	return (
		<Flex display="inline-flex" flexDir="column">
			<Flex pl={8}>
				{rows[0].map(key => (
					<Key symbol={key} key={key} />
				))}
			</Flex>
			<Flex mt="-2px" pl={14}>
				{rows[1].map(key => (
					<Key symbol={key} key={key} />
				))}
			</Flex>
			<Flex mt="-2px">
				{rows[2].map(key => (
					<Key symbol={key} key={key} />
				))}
			</Flex>
		</Flex>
	);
}
