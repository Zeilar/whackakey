import { useRouter } from "next/router";
import { createContext, useEffect, useReducer, useState } from "react";
import { Socket, io } from "socket.io-client";
import { PlayerJoinDto, PlayerLeaveDto, RoomDto } from "@shared";
import { RoomAction, roomReducer } from "../reducers/roomReducer";
import env from "../common/config";

const WS_ENDPOINT = env.get<string>("WS_ENDPOINT");

interface WebsocketContext {
	socket: Socket | undefined;
	latency: number | undefined;
	isConnecting: boolean;
	isOnline: boolean;
	name: string | undefined;
	rooms: RoomDto[];
}

interface WebsocketProps {
	children: React.ReactNode;
}

export const WebsocketContext = createContext({} as WebsocketContext);

export function WebsocketContextProvider({ children }: WebsocketProps) {
	const { push } = useRouter();
	const [socket, setSocket] = useState<Socket>();
	const [latency, setLatency] = useState<number>();
	const [isConnecting, setIsConnecting] = useState(true);
	const [isOnline, setisOnline] = useState(false);
	const [name, setName] = useState<string>();
	const [rooms, dispatchRooms] = useReducer(roomReducer, []);

	useEffect(() => {
		setSocket(io(WS_ENDPOINT, { transports: ["websocket"] }));
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
			.on("name", setName)
			.on("connect", () => {
				setIsConnecting(false);
			})
			.on("rooms-get", (rooms: RoomDto[]) => {
				dispatchRooms({ type: RoomAction.GET_ALL, rooms });
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
				setName(undefined);
				setSocket(io(WS_ENDPOINT, { transports: ["websocket"] }));
			});
		return () => {
			socket
				.off("connect")
				.off("disconnect")
				.off("name")
				.off("rooms-get")
				.off("room-new")
				.off("room-remove")
				.off("room-player-join")
				.off("room-player-leave");
		};
	}, [socket]);

	useEffect(() => {
		setisOnline(socket?.connected ?? false);
	}, [socket?.connected]);

	const values: WebsocketContext = {
		socket,
		latency,
		isConnecting,
		isOnline,
		name,
		rooms,
	};

	return <WebsocketContext.Provider value={values}>{children}</WebsocketContext.Provider>;
}
