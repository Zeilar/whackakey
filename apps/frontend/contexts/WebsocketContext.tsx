import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Player, PlayerJoinDto, PlayerLeaveDto, RoomDto } from "@shared";
import { RoomAction, roomReducer } from "../reducers/roomReducer";
import env from "../common/config";
import { toast } from "react-toastify";

interface WebsocketContext {
	socket: Socket | undefined;
	latency: number | undefined;
	isConnecting: boolean;
	isOnline: boolean;
	rooms: RoomDto[];
	room: RoomDto | undefined;
	player: Player | undefined;
}

interface WebsocketProps {
	children: React.ReactNode;
}

export const WebsocketContext = createContext({} as WebsocketContext);

export function WebsocketContextProvider({ children }: WebsocketProps) {
	const { push, query } = useRouter();
	const [socket, setSocket] = useState<Socket>();
	const [latency, setLatency] = useState<number>();
	const [isConnecting, setIsConnecting] = useState(true);
	const [isOnline, setisOnline] = useState(false);
	const [rooms, dispatchRooms] = useReducer(roomReducer, []);
	const room = useMemo(() => rooms.find(room => room.id === query.roomId), [rooms, query.roomId]);
	const player = useMemo(() => room?.players.find(player => player.id === socket?.id), [room, socket]);

	useEffect(() => {
		setSocket(io(env.get<string>("WS_ENDPOINT"), { transports: ["websocket"] }));
	}, []);

	useEffect(() => {
		if (!socket) {
			return;
		}
		const interval = setInterval(() => {
			if (!socket.connected) {
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

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on("room-join", roomId => {
			push(`/room/${roomId}`);
		});
		return () => {
			socket.off("room-join");
		};
	}, [socket, push]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket
			.on("error", toast.error)
			.on("connect", () => {
				setisOnline(true);
				setIsConnecting(false);
			})
			.on("room-active", (roomId: string) => {
				dispatchRooms({ type: RoomAction.START, roomId });
			})
			.on("room-inactive", (roomId: string) => {
				dispatchRooms({ type: RoomAction.END, roomId });
			})
			.on("rooms-get", (rooms: RoomDto[]) => {
				dispatchRooms({ type: RoomAction.GET_ALL, rooms });
			})
			.on("room-update", (room: RoomDto) => {
				dispatchRooms({ type: RoomAction.SNAPSHOT, room });
			})
			.on("room-new", (room: RoomDto) => {
				dispatchRooms({ type: RoomAction.ADD, room });
			})
			.on("room-remove", (roomId: string) => {
				dispatchRooms({ type: RoomAction.REMOVE, roomId });
			})
			.on("room-player-join", (dto: PlayerJoinDto) => {
				dispatchRooms({ type: RoomAction.PLAYER_JOIN, ...dto });
			})
			.on("room-player-leave", (dto: PlayerLeaveDto) => {
				dispatchRooms({ type: RoomAction.PLAYER_LEAVE, ...dto });
			})
			.on("disconnect", () => {
				setisOnline(false);
				setIsConnecting(true);
				dispatchRooms({ type: RoomAction.EMPTY });
				socket.connect();
			});
		return () => {
			socket
				.off("connect")
				.off("disconnect")
				.off("error")
				.off("rooms-get")
				.off("room-update")
				.off("room-new")
				.off("room-remove")
				.off("room-player-join")
				.off("room-player-leave")
				.off("room-active")
				.off("room-inactive");
		};
	}, [socket]);

	useEffect(() => {
		setisOnline(socket?.connected ?? false);
		setIsConnecting(false);
	}, [socket?.connected]);

	const values: WebsocketContext = {
		socket,
		latency,
		isConnecting,
		isOnline,
		rooms,
		room,
		player,
	};

	return <WebsocketContext.Provider value={values}>{children}</WebsocketContext.Provider>;
}
