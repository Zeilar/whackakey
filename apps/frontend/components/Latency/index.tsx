import { Box, Flex, Heading, Icon, Portal, Spinner, Tooltip } from "@chakra-ui/react";
import { Person } from "@styled-icons/evaicons-solid";
import { useEffect, useState } from "react";
import { useWebsocketContext } from "../../hooks/";

export default function Latency() {
	const { socket, isConnecting, isOnline, name } = useWebsocketContext();
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
			<Flex pos="fixed" top={4} right={4} gap={2}>
				<Flex alignItems="center" gap={1}>
					{isConnecting ? (
						<Spinner color="blue.300" size="lg" />
					) : (
						<>
							<Heading size="lg" textStyle="stroke">
								{typeof latency === "number" && `${latency}ms`}
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
				{name && (
					<Tooltip
						sx={{ bgColor: "cyan.600" }}
						fontSize="lg"
						borderColor="cyan.700"
						borderWidth={3}
						placement="bottom-start"
						label={name}
						closeOnClick={false}
					>
						<Icon color="cyan.600" stroke="black" as={Person} w={10} h={10} />
					</Tooltip>
				)}
			</Flex>
		</Portal>
	);
}
