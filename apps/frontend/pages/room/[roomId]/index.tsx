import {
	Box,
	Button,
	Flex,
	Grid,
	Heading,
	Icon,
	IconButton,
	Input,
	Link,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { Heart } from "@styled-icons/evaicons-solid";
import { useWebsocketContext } from "apps/frontend/hooks";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	ChangeDifficultyDto,
	DEFAULT_LIVES,
	Difficulty,
	MAX_LILVES,
	MAX_PLAYERS,
	NewMessageDto,
	NewOwnerDto,
	SendMessageDto,
	SetLivesDto,
} from "@shared";
import { TrophyFill } from "@styled-icons/bootstrap";
import { Crown } from "@styled-icons/fa-solid";
import MultiplayerGame from "apps/frontend/components/MultiplayerGame";
import { Menu } from "apps/frontend/components/Menu";
import { toast } from "react-toastify";
import { RoomActions } from "apps/frontend/reducers/roomReducer";
import LobbyResult from "apps/frontend/components/LobbyResult";
import { Result } from "apps/frontend/types/multiplayer";
import { AnimatePresence } from "framer-motion";
import { scrollbar } from "apps/frontend/layout/styles";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export default function Room() {
	const { query, push } = useRouter();
	const { socket, room, isMe, dispatchRooms } = useWebsocketContext();
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
	const chatBox = useRef<HTMLDivElement>(null);
	const [result, setResult] = useState<Result>();

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
			.on("game-starting", timestamp => {
				setTimestamp(timestamp);
				setResult(undefined);
			})
			.on("winner", (name: string) => {
				setTimestamp(undefined);
				setResult({ winner: name, type: "winner" });
			})
			.on("tie", () => {
				setTimestamp(undefined);
				setResult({ type: "tie" });
			});
		return () => {
			socket.off("game-starting").off("winner").off("tie");
		};
	}, [socket]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket
			.on("room-message-new", (dto: NewMessageDto) => {
				dispatchRooms({ type: RoomActions.NEW_MESSAGE, ...dto });
				chatBox.current?.scrollTo({ top: 9999 });
			})
			.on("room-new-owner", ({ roomId, ownerId }: NewOwnerDto) => {
				dispatchRooms({ type: RoomActions.NEW_OWNER, roomId, ownerId });
				if (ownerId !== socket.id) {
					return;
				}
				toast.info("You are now the room owner.");
			})
			.on("room-change-difficulty", (dto: ChangeDifficultyDto) => {
				dispatchRooms({ type: RoomActions.CHANGE_DIFFICULTY, ...dto });
			})
			.on("room-set-lives", (dto: SetLivesDto) => {
				dispatchRooms({ type: RoomActions.SET_LIVES, ...dto });
			});
		return () => {
			socket.off("room-message-new").off("room-change-difficulty").off("room-new-owner").off("room-set-lives");
		};
	}, [socket, dispatchRooms]);

	if (!room) {
		return (
			<Flex flexDir="column" alignItems="center" gap={8}>
				<Heading size="4xl" textStyle="stroke" textTransform="uppercase">
					Room not found
				</Heading>
				<Flex w={550} flexDir="column" gap={2}>
					<NextLink href="/?menu=rooms" passHref>
						<Button as={Link} size="xl">
							Browse Rooms
						</Button>
					</NextLink>
					<NextLink href="/" passHref>
						<Button as={Link} size="xl">
							Main menu
						</Button>
					</NextLink>
				</Flex>
			</Flex>
		);
	}

	if (typeof timestamp === "number") {
		return <MultiplayerGame timestamp={timestamp} />;
	}

	function difficultyBgColor(difficulty: Difficulty) {
		if (difficulty !== room?.difficulty) {
			return "gray.100";
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

	function sendMessage(e: React.FormEvent) {
		e.preventDefault();
		if (!socket || !messageInput) {
			return;
		}
		socket.emit("room-message-new", { roomId: query.roomId, content: messageInput } as SendMessageDto);
		setMessageInput("");
	}

	function setLives(lives: number) {
		if (!room || !isOwner || !socket) {
			return;
		}
		socket.emit("room-set-lives", { roomId: query.roomId, lives } as SetLivesDto);
	}

	return (
		<Flex
			flexDir="column"
			bgColor="gray.100"
			rounded="xl"
			borderWidth={4}
			borderColor="blue.900"
			w={900}
			overflow="hidden"
			boxShadow="lg"
		>
			<Flex p={4} justifyContent="space-between" borderBottomWidth="inherit" borderBottomColor="inherit">
				<Heading size="md">{room.name}</Heading>
				<Heading size="md">
					{room.players.length} / {MAX_PLAYERS}
				</Heading>
			</Flex>
			<AnimatePresence>
				{result && <LobbyResult {...result} onClose={() => setResult(undefined)} />}
			</AnimatePresence>
			<Grid gridTemplateColumns="1fr 1fr" gridGap={4} p={4} bgColor="gray.300">
				<Flex flexDir="column" gap={2}>
					{room.players.map(player => (
						<Flex key={player.id} gap={1} order={!isMe(player.id) ? 1 : undefined}>
							<Tooltip
								isDisabled={!isOwner}
								label={player.id === room.ownerId ? "Room owner" : "Make owner"}
								placement="top"
							>
								<IconButton
									aria-label="Make owner"
									variant="unstyled"
									icon={<Crown style={{ padding: "0.5rem" }} />}
									h="100%"
									rounded="md"
									color="gray.100"
									borderWidth={3}
									borderColor={isMe(player.id) ? "yellow.600" : "blue.900"}
									bgColor={isMe(player.id) ? "yellow.500" : "blue.700"}
									w="44px"
									opacity={player.id === room.ownerId ? 1 : 0.5}
									_hover={
										isOwner && player.id !== room.ownerId
											? {
													opacity: 1,
													"& > svg": { color: "yellow.500" },
											  }
											: undefined
									}
									onClick={() =>
										socket?.emit("room-set-owner", {
											roomId: query.roomId,
											ownerId: player.id,
										} as NewOwnerDto)
									}
									disabled={!isOwner || player.id === room.ownerId}
									_disabled={{ pointerEvents: "none" }}
								/>
							</Tooltip>
							<Flex
								borderColor={isMe(player.id) ? "yellow.600" : "blue.900"}
								borderWidth={3}
								bgColor="gray.100"
								rounded="md"
								alignItems="center"
								pos="relative"
								overflow="hidden"
								grow={1}
							>
								<Flex flexGrow={1}>
									<Text
										py={2}
										px={4}
										size="lg"
										color={isMe(player.id) ? "yellow.600" : undefined}
										whiteSpace="nowrap"
									>
										{isMe(player.id) ? (
											<Text userSelect="none" as="span" mr={1}>
												(You)&nbsp;
											</Text>
										) : undefined}
										{player.name}
									</Text>
								</Flex>
								<Tooltip label="Wins" placement="top" closeOnClick={false}>
									<Flex
										w="4.25rem"
										h="100%"
										alignItems="center"
										userSelect="none"
										color="gray.100"
										borderLeftWidth={3}
										borderLeftColor="inherit"
										bgColor={isMe(player.id) ? "yellow.500" : "blue.700"}
									>
										<Icon as={TrophyFill} w={10} h="100%" p={3} />
										{player.wins}
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
								borderWidth={3}
								bgColor="gray.400"
								rounded="md"
								py={2}
								px={4}
								alignItems="center"
								justifyContent="space-between"
								order={1}
							>
								<Text size="lg" fontStyle="italic" color="gray.500" userSelect="none">
									Slot available
								</Text>
							</Flex>
						))}
				</Flex>
				<Flex flexDir="column" gap={4}>
					<Flex flexDir="column" gap={1}>
						<Heading size="md">Difficulty</Heading>
						<Flex gap={2}>
							{difficulties.map(difficulty => (
								<Box
									key={difficulty}
									as="button"
									userSelect="none"
									w="100%"
									alignItems="center"
									bgColor={difficultyBgColor(difficulty)}
									borderColor={difficulty === room?.difficulty ? "blue.900" : "gray.400"}
									borderWidth={3}
									px={4}
									py={2}
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
					<Flex gap={1} flexDir="column">
						<Flex alignItems="center" gap={2}>
							<Heading size="md">Lives</Heading>
							<Flex gap={1}>
								{Array(room.lives)
									.fill(null)
									.map((_, i) => (
										<Icon
											key={i}
											strokeWidth={3}
											as={Heart}
											w={6}
											h={6}
											color="red.500"
											stroke="blue.900"
										/>
									))}
							</Flex>
						</Flex>
						<Slider
							min={1}
							value={room.lives}
							isDisabled={!isOwner}
							size="lg"
							onChange={setLives}
							max={MAX_LILVES}
							defaultValue={DEFAULT_LIVES}
						>
							<SliderTrack bgColor="gray.100" _disabled={{ bgColor: "gray.200" }}>
								<SliderFilledTrack bgColor="blue.900" />
							</SliderTrack>
							<SliderThumb borderColor="blue.900" borderWidth={2} _disabled={{ bgColor: "gray.200" }} />
						</Slider>
					</Flex>
				</Flex>
			</Grid>
			<Flex
				borderTopWidth="inherit"
				borderBottomWidth="inherit"
				borderColor="inherit"
				flexDir="column"
				bgColor="gray.300"
			>
				<Flex h={200} overflowY="auto" p={4} pb={0} flexDir="column" gap={2} ref={chatBox} sx={scrollbar}>
					{room.messages.map(message => (
						<Flex key={message.id} gap={2}>
							<Text whiteSpace="nowrap" color={isMe(message.authorId) ? "yellow.500" : undefined}>
								{message.name}:
							</Text>
							<Text>{message.content}</Text>
						</Flex>
					))}
				</Flex>
				<Flex as="form" p={4} grow={1} gap={4} onSubmit={sendMessage}>
					<Input
						value={messageInput}
						autoFocus
						onChange={e => setMessageInput(e.target.value)}
						variant="unstyled"
						placeholder="Send a message"
					/>
					<Button type="submit" px={12} disabled={messageInput.length === 0}>
						Send
					</Button>
				</Flex>
			</Flex>
			<Flex justifyContent="space-between" bgColor="gray.100" p={4}>
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
