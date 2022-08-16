import { Box, Button, Flex, Grid, Heading, Icon, Input, Link, Text, Tooltip } from "@chakra-ui/react";
import { Undo } from "@styled-icons/evaicons-solid";
import { useWebsocketContext } from "apps/frontend/hooks";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChangeDifficultyDto, Difficulty, MAX_PLAYERS, SendMessageDto } from "@shared";
import { TrophyFill } from "@styled-icons/bootstrap";
import { Crown } from "@styled-icons/fa-solid";
import MultiplayerGame from "apps/frontend/components/MultiplayerGame";
import { Menu } from "apps/frontend/components/Menu";
import { toast } from "react-toastify";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export default function Room() {
	const { query, push } = useRouter();
	const { socket, room, isMe } = useWebsocketContext();
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
	const [messageInput, setMessageInput] = useState("");

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
		socket
			.on("game-starting", setTimestamp)
			.on("winner", (name: string) => {
				toast.success(`${name} wins the game!`);
				setTimestamp(undefined);
			})
			.on("tie", () => {
				toast.warn("The game ends in a tie!");
				setTimestamp(undefined);
			});
		return () => {
			socket.off("game-starting").off("winner").off("tie");
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

	function playerBgColor(playerId: string) {
		return isMe(playerId) ? "player.600" : "blue.900";
	}

	function playerColor(playerId: string) {
		return isMe(playerId) ? "player.900" : "blue.900";
	}

	function difficultyBgColor(difficulty: Difficulty) {
		if (difficulty !== room?.difficulty) {
			return "gray.200";
		}
		switch (difficulty) {
			case "easy":
				return "green.500";
			case "medium":
				return "yellow.500";
			case "hard":
				return "red.500";
		}
	}

	function difficultyBorderColor(difficulty: Difficulty) {
		if (difficulty !== room?.difficulty) {
			return "gray.400";
		}
		switch (difficulty) {
			case "easy":
				return "green.200";
			case "medium":
				return "yellow.200";
			case "hard":
				return "red.200";
		}
	}

	function sendMessage(e: React.FormEvent) {
		e.preventDefault();
		if (!socket || !messageInput) {
			return;
		}
		socket.emit("room-message-new", { roomId: query.roomId, content: messageInput } as SendMessageDto);
		setMessageInput("");
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
				<Heading size="lg">{room.name}</Heading>
				<Heading size="lg">
					{room.players.length} / {MAX_PLAYERS}
				</Heading>
			</Flex>
			<Grid gridTemplateColumns="1fr 1fr" gridGap={4} p={4} bgColor="gray.300">
				<Flex flexDir="column" gap={4}>
					{room.players.map(player => (
						<Flex
							key={player.id}
							borderColor={playerBgColor(player.id)}
							borderWidth={2}
							bgColor="gray.100"
							rounded="md"
							alignItems="center"
							pos="relative"
						>
							{player.id === room.ownerId && (
								<Tooltip label="Room owner" placement="top" closeOnClick={false}>
									<Icon
										as={Crown}
										h="100%"
										color="gray.100"
										w={10}
										p={2}
										pr={3}
										bgColor={playerBgColor(player.id)}
									/>
								</Tooltip>
							)}
							<Flex
								py={2}
								px={4}
								justifyContent="space-between"
								flexGrow={1}
								color={playerColor(player.id)}
							>
								<Text size="lg">{player.name}</Text>
								<Tooltip label="Wins" placement="top" closeOnClick={false}>
									<Flex alignItems="center" gap={1} userSelect="none">
										<Text>{player.wins}</Text>
										<Icon as={TrophyFill} />
									</Flex>
								</Tooltip>
							</Flex>
						</Flex>
					))}
					{Array(slotsAvailable)
						.fill(null)
						.map((_, i) => (
							<Flex
								key={i}
								borderColor="gray.500"
								borderWidth={2}
								bgColor="gray.400"
								rounded="md"
								py={2}
								px={4}
								alignItems="center"
								justifyContent="space-between"
							>
								<Text size="lg" fontStyle="italic" color="gray.500" userSelect="none">
									Slot available
								</Text>
							</Flex>
						))}
				</Flex>
				<Flex flexDir="column" gap={4}>
					<Flex gap={2}>
						{difficulties.map(difficulty => (
							<Box
								key={difficulty}
								as="button"
								userSelect="none"
								w="100%"
								alignItems="center"
								bgColor={difficultyBgColor(difficulty)}
								borderColor={difficultyBorderColor(difficulty)}
								px={4}
								py={2}
								borderWidth={2}
								rounded="lg"
								disabled={!isOwner}
								opacity={isOwner ? 1 : 0.5}
								onClick={() =>
									socket?.emit("room-change-difficulty", {
										roomId: query.roomId,
										difficulty,
									} as ChangeDifficultyDto)
								}
								_disabled={{ cursor: "default" }}
							>
								<Text
									textAlign="center"
									textTransform="uppercase"
									color={difficulty === room.difficulty ? "gray.100" : undefined}
								>
									{difficulty}
								</Text>
							</Box>
						))}
					</Flex>
				</Flex>
			</Grid>
			<Flex borderTopWidth={5} borderBottomWidth={5} borderColor="inherit" flexDir="column">
				<Flex h={250} overflowY="auto" p={4} flexDir="column" gap={2}>
					{room.messages.map(message => (
						<Flex key={message.id} gap={2}>
							<Text color={isMe(message.authorId) ? "player.500" : undefined}>{message.name}:</Text>
							<Text>{message.content}</Text>
						</Flex>
					))}
				</Flex>
				<Flex as="form" p={4} grow={1} gap={4} onSubmit={sendMessage}>
					<Input
						value={messageInput}
						onChange={e => setMessageInput(e.target.value)}
						variant="unstyled"
						placeholder="Send a message"
					/>
					<Button type="submit" px={12}>
						Send
					</Button>
				</Flex>
			</Flex>
			<Flex justifyContent="space-between" bgColor="gray.300" p={4}>
				<Button
					px={12}
					size="lg"
					onClick={() => push({ pathname: "/", query: { menu: "multiplayer" as Menu } })}
				>
					Back
				</Button>
				<Button
					variant="success"
					size="lg"
					onClick={() => socket?.emit("game-start", query.roomId)}
					disabled={room.players.length < 2 || !isOwner}
				>
					Start
				</Button>
			</Flex>
		</Flex>
	);
}
