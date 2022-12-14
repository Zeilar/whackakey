import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { MAX_PLAYERS } from "@shared";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useWebsocketContext } from "../../hooks";
import { RoomActions } from "../../reducers/roomReducer";
import { Menu } from "./../Menu";

export default function RoomBrowser() {
	const { push } = useRouter();
	const { rooms, socket, dispatchRooms } = useWebsocketContext();
	const [selectedRoomId, setSelectedRoomId] = useState<string>();
	const [hasRendered, setHasRendered] = useState(false);

	useEffect(() => {
		setHasRendered(true);
	}, []);

	const isSelected = useCallback(
		(roomId: string) => {
			return selectedRoomId === roomId;
		},
		[selectedRoomId]
	);

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

	const join = useCallback(() => {
		push(`/room/${selectedRoomId}`);
	}, [push, selectedRoomId]);

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
				<AnimatePresence>
					{rooms.length > 0 &&
						rooms.map(
							room =>
								!room.isGameActive && (
									<Box
										key={room.id}
										as={motion.div}
										w="full"
										transition={{ duration: "0.1s" }}
										initial={
											hasRendered
												? {
														opacity: 0,
														transform: "translateX(5px)",
												  }
												: undefined
										}
										animate={{
											opacity: 1,
											transform: "translateX(0px)",
										}}
										exit={{
											opacity: 0,
											transform: "translateX(5px)",
										}}
									>
										<Button
											fontSize="2xl"
											display="flex"
											w="full"
											justifyContent="space-between"
											paddingInline={4}
											py={8}
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
												isSelected(room.id)
													? "0 0 0 2px var(--chakra-colors-blue-900)"
													: undefined
											}
											_hover={{ bgColor: !isSelected(room.id) ? "gray.50" : undefined }}
											_focus={{ outline: 0 }}
										>
											<Text>{room.name}</Text>
											<Text>
												{room.players.length} / {MAX_PLAYERS}
											</Text>
										</Button>
									</Box>
								)
						)}
				</AnimatePresence>
			</Flex>
			<Flex p={4} borderTopWidth={4} borderColor="inherit" justifyContent="space-between">
				<Button px={12} size="lg" onClick={() => push({ query: { menu: "multiplayer" as Menu } })}>
					Back
				</Button>
				<Flex gap={2}>
					<Button size="lg" onClick={() => socket?.emit("room-create")}>
						Create
					</Button>
					<Button size="lg" variant="success" onClick={join} disabled={selectedRoomId === undefined}>
						Join
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}
