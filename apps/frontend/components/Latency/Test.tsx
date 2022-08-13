import { Button, Flex, Portal } from "@chakra-ui/react";
import { useWebsocketContext } from "../../hooks/";

export default function Test() {
	const { socket, rooms } = useWebsocketContext();
	return (
		<Portal>
			<Flex h={8} pos="fixed" top={20} right={4} alignItems="center" gap={2}>
				<Button onClick={() => console.log(rooms)}>Log rooms</Button>
				<Button onClick={() => socket?.emit("room-create")}>Create room</Button>
			</Flex>
		</Portal>
	);
}
