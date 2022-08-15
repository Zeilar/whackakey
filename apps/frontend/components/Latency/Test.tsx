import { Button, Flex, Portal } from "@chakra-ui/react";
import Link from "next/link";
import { useWebsocketContext } from "../../hooks/";

export default function Test() {
	const { rooms } = useWebsocketContext();
	return (
		<Portal>
			<Flex h={8} pos="fixed" top={20} right={4} alignItems="center" gap={2} flexDir="column">
				<Flex gap={2}>
					<Button onClick={() => console.log(rooms)}>Log rooms</Button>
				</Flex>
				<Flex flexDir="column">
					{rooms.map(room => (
						<Link passHref href={`/room/${room.id}`} key={room.id}>
							<Button>{room.id}</Button>
						</Link>
					))}
				</Flex>
			</Flex>
		</Portal>
	);
}
