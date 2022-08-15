import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { MAX_PLAYERS } from "@shared";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWebsocketContext } from "../hooks";
import { RoomActions } from "../reducers/roomReducer";
import { Menu } from "./Menu";

export default function RoomBrowser() {
	const { push } = useRouter();
	const { rooms, socket, dispatchRooms } = useWebsocketContext();
	const [selectedRoomId, setSelectedRoomId] = useState<string>();

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on("room-active", (roomId: string) => {
			dispatchRooms({ type: RoomActions.START, roomId });
			if (roomId !== selectedRoomId) {
				return;
			}
			setSelectedRoomId(undefined);
		});
		return () => {
			socket.off("room-active");
		};
	}, [socket, rooms, selectedRoomId, dispatchRooms]);

	useEffect(() => {
		if (rooms.length > 0) {
			return;
		}
		setSelectedRoomId(undefined);
	}, [rooms]);

	function isSelected(roomId: string) {
		return selectedRoomId === roomId;
	}

	function join() {
		push(`/room/${selectedRoomId}`);
	}

	return (
		<Flex
			flexDir="column"
			h={500}
			bgColor="gray.300"
			overflowY="auto"
			rounded="xl"
			borderWidth={4}
			borderColor="blue.900"
			justifyContent="space-between"
		>
			<Flex flexDir="column" p={4} gap={2}>
				{rooms.length > 0 ? (
					rooms.map(
						room =>
							!room.isGameActive && (
								<Button
									key={room.id}
									display="flex"
									justifyContent="space-between"
									paddingInline={4}
									variant="unstyled"
									color={isSelected(room.id) ? "gray.100" : "blue.900"}
									bgColor={isSelected(room.id) ? "blue.900" : "gray.100"}
									borderColor={isSelected(room.id) ? "blue.900" : "gray.400"}
									borderWidth={2}
									disabled={room.isGameActive}
									onClick={() => setSelectedRoomId(room.id)}
									onDoubleClick={join}
									rounded="md"
									boxShadow={
										isSelected(room.id) ? "0 0 0 2px var(--chakra-colors-blue-900)" : undefined
									}
									_hover={{ bgColor: !isSelected(room.id) ? "gray.50" : undefined }}
									_focus={{ outline: 0 }}
								>
									<Text>{room.name}</Text>
									<Text>
										{room.players.length} / {MAX_PLAYERS}
									</Text>
								</Button>
							)
					)
				) : (
					<Heading textStyle="stroke" textAlign="center">
						No rooms were found
					</Heading>
				)}
			</Flex>
			<Flex p={4} borderTopWidth={4} borderColor="inherit" justifyContent="space-between">
				<Button px={12} size="lg" onClick={() => push({ query: { menu: "multiplayer" as Menu } })}>
					Back
				</Button>
				<Button
					size="lg"
					px={12}
					bgColor="green.500"
					color="gray.100"
					borderColor="green.600"
					onClick={join}
					disabled={selectedRoomId === undefined}
					_hover={{ bgColor: "green.400" }}
					_active={{}}
				>
					Join
				</Button>
			</Flex>
		</Flex>
	);
}
