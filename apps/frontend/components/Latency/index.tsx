import { Box, Flex, Heading, Portal, Spinner } from "@chakra-ui/react";
import { useWebsocketContext } from "../../hooks/";

export default function Latency() {
	const { latency, isConnecting, isOnline } = useWebsocketContext();
	return (
		<Portal>
			<Flex h={8} pos="fixed" top={4} right={4} alignItems="center" gap={2}>
				{isConnecting ? (
					<Spinner color="blue.300" size="lg" />
				) : (
					<>
						<Heading size="lg" textStyle="stroke">
							{typeof latency === "number" ? `${latency}ms` : "Offline"}
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
		</Portal>
	);
}
