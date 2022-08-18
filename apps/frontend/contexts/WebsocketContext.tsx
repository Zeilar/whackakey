import { useRouter } from "next/router";
import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Player, PlayerJoinDto, PlayerLeaveDto, RoomDto } from "@shared";
import { RoomAction, RoomActions, roomReducer } from "../reducers/roomReducer";
import env from "../common/config";
import { toast } from "react-toastify";

interface IWebsocketContext {
	socket: Socket | undefined;
	isConnecting: boolean;
	isOnline: boolean;
	rooms: RoomDto[];
	room: RoomDto | undefined;
	player: Player | undefined;
	dispatchRooms(value: RoomAction): void;
	isMe(playerId: string): boolean;
	name: string | null;
}

interface WebsocketProps {
	children: React.ReactNode;
}

export const WebsocketContext = createContext({} as IWebsocketContext);

export function WebsocketContextProvider({ children }: WebsocketProps) {
	const { push, query } = useRouter();
	const [socket, setSocket] = useState<Socket>();
	const [isConnecting, setIsConnecting] = useState(true);
	const [isOnline, setisOnline] = useState(false);
	const [rooms, dispatchRooms] = useReducer(roomReducer, []);
	const [name, setName] = useState<string | null>(null);
	const room = useMemo(() => rooms.find(room => room.id === query.roomId), [rooms, query.roomId]);
	const player = useMemo(() => room?.players.find(player => player.id === socket?.id), [room, socket]);

	const isMe = useCallback(
		(playerId: string) => {
			if (!socket) {
				return false;
			}
			return socket.id === playerId;
		},
		[socket]
	);

	useEffect(() => {
		setSocket(io(env.get<string>("WS_ENDPOINT"), { transports: ["websocket"] }));
	}, []);

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
			.on("name", setName)
			.on("room-inactive", (roomId: string) => {
				dispatchRooms({ type: RoomActions.END, roomId });
			})
			.on("rooms-get", (rooms: RoomDto[]) => {
				dispatchRooms({ type: RoomActions.GET_ALL, rooms });
			})
			.on("room-update", (room: RoomDto) => {
				dispatchRooms({ type: RoomActions.SNAPSHOT, room });
			})
			.on("room-new", (room: RoomDto) => {
				dispatchRooms({ type: RoomActions.ADD, room });
			})
			.on("room-remove", (roomId: string) => {
				dispatchRooms({ type: RoomActions.REMOVE, roomId });
			})
			.on("room-player-join", (dto: PlayerJoinDto) => {
				dispatchRooms({ type: RoomActions.PLAYER_JOIN, ...dto });
			})
			.on("room-player-leave", (dto: PlayerLeaveDto) => {
				dispatchRooms({ type: RoomActions.PLAYER_LEAVE, ...dto });
			})
			.on("disconnect", () => {
				setIsConnecting(true);
				dispatchRooms({ type: RoomActions.EMPTY });
				setisOnline(false);
				socket.connect();
			});
		return () => {
			socket
				.off("connect")
				.off("disconnect")
				.off("error")
				.off("name")
				.off("rooms-get")
				.off("room-update")
				.off("room-new")
				.off("room-remove")
				.off("room-player-join")
				.off("room-player-leave")
				.off("room-inactive");
		};
	}, [socket]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		setIsConnecting(false);
		setisOnline(socket.connected);
	}, [socket, socket?.connected]);

	const values: IWebsocketContext = {
		socket,
		isConnecting,
		isOnline,
		rooms,
		room,
		player,
		dispatchRooms,
		isMe,
		name,
	};

	return <WebsocketContext.Provider value={values}>{children}</WebsocketContext.Provider>;
}
