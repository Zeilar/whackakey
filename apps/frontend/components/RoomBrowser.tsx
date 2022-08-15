import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { MAX_PLAYERS } from "@shared";
import { useRouter } from "next/router";
import { useState } from "react";
import { useWebsocketContext } from "../hooks";

interface Props {
	onBack(): void;
}

export default function RoomBrowser({ onBack }: Props) {
	const { push } = useRouter();
	const { rooms } = useWebsocketContext();
	const [selectedRoomId, setSelectedRoomId] = useState<string>();

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
					rooms.map(room => (
						<Button
							key={room.id}
							display="flex"
							justifyContent="space-between"
							paddingInline={4}
							variant="unstyled"
							bgColor={selectedRoomId === room.id ? "gray.50" : "gray.100"}
							borderWidth={2}
							borderColor="blue.900"
							disabled={room.isGameActive}
							onClick={() => setSelectedRoomId(room.id)}
							rounded="md"
							boxShadow={
								selectedRoomId === room.id ? "0 0 0 2px var(--chakra-colors-blue-900)" : undefined
							}
							_hover={{ bgColor: "gray.50" }}
							_focus={{ outline: 0 }}
						>
							<Text>{room.name}</Text>
							<Text>
								{room.players.length} / {MAX_PLAYERS}
							</Text>
						</Button>
					))
				) : (
					<Heading textStyle="stroke" textAlign="center">
						No rooms were found
					</Heading>
				)}
			</Flex>
			<Flex p={4} borderTopWidth={4} borderColor="inherit" justifyContent="space-between">
				<Button px={12} size="lg" onClick={onBack}>
					Back
				</Button>
				<Button
					size="lg"
					px={12}
					bgColor="green.500"
					color="gray.100"
					borderColor="green.600"
					onClick={() => push(`/room/${selectedRoomId}`)}
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
