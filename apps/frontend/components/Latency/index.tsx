import { Box, Flex, Heading, IconButton, Portal, Spinner } from "@chakra-ui/react";
import { Refresh } from "@styled-icons/evaicons-solid";
import { useEffect, useState } from "react";
import { useWebsocketContext } from "../../hooks/";

export default function Latency() {
	const { socket, isConnecting, isOnline, player } = useWebsocketContext();
	const [latency, setLatency] = useState<number>();

	useEffect(() => {
		if (!socket) {
			return;
		}
		const interval = setInterval(() => {
			if (!socket.connected) {
				setLatency(undefined);
				return;
			}
			const start = Date.now();
			socket.emit("ping", () => {
				setLatency(Date.now() - start);
			});
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [socket]);

	return (
		<Portal>
			<Flex flexDir="column" pos="fixed" top={4} right={4} gap={2}>
				<Flex h={8} alignItems="center" gap={2} justifyContent="flex-end">
					{isConnecting ? (
						<Spinner color="blue.300" size="lg" />
					) : (
						<>
							{!isOnline && socket && (
								<IconButton
									variant="unstyled"
									color="gray.100"
									border={0}
									size="sm"
									aria-label="Reconnect"
									icon={<Refresh />}
									onClick={() => socket?.connect()}
									_focus={{}}
								/>
							)}
							<Heading size="lg" textStyle="stroke">
								{typeof latency === "number" ? `${latency}ms` : "Pinging..."}
							</Heading>
							<Box
								borderWidth={3}
								borderColor="blue.900"
								bgColor={isOnline ? "green.500" : "red.500"}
								rounded="full"
								w={6}
								h={6}
							/>
						</>
					)}
				</Flex>
				{player && (
					<Heading textStyle="stroke" color="blue.500">
						{player.name}
					</Heading>
				)}
			</Flex>
		</Portal>
	);
}
