import { Button, Flex, Grid, Heading, Icon, Link, Text, Tooltip } from "@chakra-ui/react";
import { Undo } from "@styled-icons/evaicons-solid";
import { useWebsocketContext } from "apps/frontend/hooks";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MAX_PLAYERS } from "@shared";
import { TrophyFill } from "@styled-icons/bootstrap";
import { Crown } from "@styled-icons/fa-solid";
import MultiplayerGame from "apps/frontend/components/MultiplayerGame";

export default function Room() {
	const { query } = useRouter();
	const { socket, room } = useWebsocketContext();
	const isOwner = useMemo(() => {
		if (!room?.ownerId || !socket) {
			return false;
		}
		return socket.id === room.ownerId;
	}, [room?.ownerId, socket]);
	const slotsAvailable = useMemo(() => (room ? Math.max(0, MAX_PLAYERS - room.players.length) : 0), [room]);
	const hasPlayer = useMemo(
		() => room?.players.some(player => player.id === socket?.id),
		[room?.players, socket?.id]
	);
	const [timestamp, setTimestamp] = useState<number>();

	useEffect(() => {
		if (!socket || !query.roomId || hasPlayer) {
			return;
		}
		socket.emit("room-join", query.roomId);
	}, [socket, query.roomId, hasPlayer]);

	useEffect(() => {
		return () => {
			if (!socket || !query.roomId) {
				return;
			}
			socket.emit("room-leave", query.roomId);
		};
	}, [socket, query.roomId]);

	useEffect(() => {
		setTimestamp(undefined);
	}, [query.roomId]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on("game-starting", setTimestamp);
		return () => {
			socket.off("game-starting");
		};
	}, [socket]);

	if (!room) {
		return (
			<Flex flexDir="column" alignItems="center" gap={4}>
				<Heading size="4xl" textStyle="stroke" textTransform="uppercase">
					Room not found
				</Heading>
				<NextLink href="/" passHref>
					<Button as={Link} size="xl">
						<Icon as={Undo} mr={4} />
						Main menu
					</Button>
				</NextLink>
			</Flex>
		);
	}

	if (typeof timestamp === "number") {
		return <MultiplayerGame timestamp={timestamp} />;
	}

	return (
		<Flex
			flexDir="column"
			bgColor="gray.100"
			rounded="xl"
			borderWidth={5}
			borderColor="blue.900"
			w={800}
			overflow="hidden"
			boxShadow="lg"
		>
			<Flex p={4} justifyContent="space-between" borderBottomWidth="inherit" borderBottomColor="inherit">
				<Heading>{room.name}</Heading>
				<Heading>
					{room.players.length} / {MAX_PLAYERS}
				</Heading>
			</Flex>
			<Grid gridTemplateColumns="repeat(2, 1fr)" p={4} bgColor="gray.300" gridGap={4}>
				{room.players.map(player => (
					<Flex
						key={player.id}
						borderColor="blue.900"
						borderWidth={3}
						bgColor="gray.100"
						rounded="md"
						py={2}
						px={4}
						alignItems="center"
						justifyContent="space-between"
						pos="relative"
					>
						{player.id === room.ownerId && (
							<Icon pos="absolute" left={1} top="calc((var(--chakra-space-4) + 1px) * -1)" as={Crown} />
						)}
						<Text size="lg">{player.name}</Text>
						<Tooltip label="Wins" placement="top" closeOnClick={false}>
							<Flex alignItems="center" gap={2} userSelect="none">
								<Text>{player.wins}</Text>
								<Icon as={TrophyFill} />
							</Flex>
						</Tooltip>
					</Flex>
				))}
				{Array(slotsAvailable)
					.fill(null)
					.map((_, i) => (
						<Flex
							key={i}
							borderColor="gray.400"
							borderWidth={3}
							bgColor="gray.100"
							rounded="md"
							py={2}
							px={4}
							alignItems="center"
							justifyContent="space-between"
						>
							<Text size="lg" fontStyle="italic" color="gray.500">
								Slot available
							</Text>
						</Flex>
					))}
			</Grid>
			<Flex justifyContent="center" gap={2} bgColor="gray.300" p={4}>
				<Button
					size="lg"
					onClick={() => socket?.emit("game-start", query.roomId)}
					disabled={room.players.length < 2 || !isOwner}
					title={!isOwner ? "Only the owner can start the game" : undefined}
				>
					Start
				</Button>
			</Flex>
		</Flex>
	);
}
