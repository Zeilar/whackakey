import useWebsocketContext from "apps/frontend/hooks/useWebsocketContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Room() {
	const { query } = useRouter();
	const { socket } = useWebsocketContext();
	useEffect(() => {
		if (!socket || !query.roomId) {
			return;
		}
		socket.emit("room-join", query.roomId);
		return () => {
			socket.emit("room-leave", query.roomId);
		};
	}, [socket, query.roomId]);
	return <div>Room {query.roomId}</div>;
}
