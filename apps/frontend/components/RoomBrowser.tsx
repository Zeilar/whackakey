import { Button, Flex, Heading } from "@chakra-ui/react";
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
			minHeight={300}
			bgColor="gray.300"
			rounded="xl"
			borderWidth={4}
			borderColor="blue.900"
			justifyContent="space-between"
		>
			<Flex flexDir="column" p={4} gap={2}>
				{rooms.length > 0 ? (
					rooms.map(room => (
						<Button key={room.id} disabled={room.isGameActive} onClick={() => setSelectedRoomId(room.id)}>
							Name placeholder
						</Button>
					))
				) : (
					<Heading textStyle="stroke" textAlign="center">
						No rooms were found
					</Heading>
				)}
			</Flex>
			<Flex p={4} borderTopWidth={4} borderColor="inherit" justifyContent="space-between">
				<Button onClick={onBack}>Back</Button>
				<Button
					bgColor="green.500"
					color="gray.100"
					borderColor="green.600"
					onClick={onBack}
					_hover={{ bgColor: "green.400" }}
					_active={{}}
				>
					Join
				</Button>
			</Flex>
		</Flex>
	);
}
