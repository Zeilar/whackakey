import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	OnGatewayDisconnect,
	OnGatewayConnection,
	OnGatewayInit,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import config from "../../config";
import { Room } from "./room.class";
import { v4 as uuidv4 } from "uuid";
import { Client } from "../../../types/ws";
import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator";

const { port } = config.ws;

function randomName() {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, animals],
		separator: " ",
		style: "capital",
		length: 2,
	});
}

@WebSocketGateway(port, { transports: ["websocket"], cors: config.app.corsOrigin })
export class WebsocketGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
	private rooms: Room[] = [];
	private clients: Client[] = [];
	private server: Server;

	public afterInit(server: Server) {
		this.server = server;
	}

	public addClient(client: Client) {
		this.clients.push(client);
	}

	public removeClient(clientId: string) {
		this.clients = this.clients.filter(client => client.id !== clientId);
	}

	public addRoom(room: Room) {
		this.rooms.push(room);
		this.server.emit("room-new", room.dto());
	}

	public removeRoom(roomId: string) {
		this.rooms = this.rooms.filter(room => room.id !== roomId);
		this.server.emit("room-remove", roomId);
	}

	public getOrCreateClient(clientId: string) {
		return this.getClientById(clientId) ?? this.createClient(clientId);
	}

	public getClientById(id: string) {
		return this.clients.find(client => client.id === id);
	}

	public getRoomById(id: string) {
		return this.rooms.find(room => room.id === id);
	}

	public createClient(id: string): Client {
		const client = {
			id,
			name: randomName(),
		};
		const socket = this.server.sockets.sockets.get(id);
		if (!socket) {
			throw new Error("Bad socket.");
		}
		this.addClient(client);
		socket.emit("name", client.name);
		return client;
	}

	public removeClientFromRoom(socket: Socket, roomId: string) {
		if (socket.id === roomId) {
			return;
		}
		const room = this.getRoomById(roomId);
		socket.leave(roomId);
		if (!room) {
			return;
		}
		room.removePlayer(socket.id);
		if (!room.isEmpty()) {
			return;
		}
		this.removeRoom(room.id);
	}

	public removeClientFromAllRooms(socket: Socket) {
		this.rooms.forEach(room => {
			room.removePlayer(socket.id);
			if (!room.isEmpty()) {
				return;
			}
			this.removeRoom(room.id);
		});
	}

	@SubscribeMessage("ping")
	public ping() {
		return "";
	}

	@SubscribeMessage("player-pick")
	public playerPick(
		@ConnectedSocket() socket: Socket,
		@MessageBody("roomId") roomId: string,
		@MessageBody("letter") letter: string
	) {
		const room = this.getRoomById(roomId);
		if (!room) {
			socket.emit("error", "Could not find room.");
			return;
		}
		if (!room.hasPlayer(socket.id)) {
			return;
		}
		room.playerPick(socket.id, letter);
	}

	@SubscribeMessage("room-leave")
	public leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
		this.removeClientFromRoom(socket, roomId);
	}

	@SubscribeMessage("room-join")
	public joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
		const room = this.getRoomById(roomId);
		if (!room) {
			socket.emit("error", "Could not find room.");
			return;
		}
		if (room.isFull()) {
			socket.emit("error", "The room is full.");
			return;
		}
		if (room.hasPlayer(socket.id)) {
			return;
		}
		room.makePlayer(this.getOrCreateClient(socket.id));
		socket.join(room.id);
		socket.emit("room-join", room.id);
	}

	@SubscribeMessage("room-create")
	public createRoom(@ConnectedSocket() socket: Socket) {
		socket.rooms.forEach(roomId => {
			this.removeClientFromRoom(socket, roomId);
		});
		const client = this.getOrCreateClient(socket.id);
		const room = new Room(this.server, client, uuidv4());
		this.addRoom(room);
		socket.join(room.id);
		socket.emit("room-join", room.id);
	}

	@SubscribeMessage("game-start")
	public startGame(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
		const room = this.getRoomById(roomId);
		if (!room) {
			socket.emit("error", "That room does not exist.");
			return;
		}
		if (!room.isOwner(socket.id)) {
			socket.emit("error", "Only the room owner can start the game.");
			return;
		}
		room.start();
	}

	public handleConnection(socket: Socket) {
		this.createClient(socket.id);
		socket.emit(
			"rooms-get",
			this.rooms.map(room => room.dto())
		);
	}

	public handleDisconnect(socket: Socket) {
		this.removeClientFromAllRooms(socket);
		this.removeClient(socket.id);
	}
}
