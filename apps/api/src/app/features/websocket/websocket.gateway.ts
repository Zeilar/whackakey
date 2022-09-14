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
import { randomName } from "../../common/util/nameGenerator";
import { Difficulty } from "@shared";

const { port } = config.ws;

@WebSocketGateway(port, { transports: ["websocket", "polling"], cors: config.app.corsOrigin })
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

	@SubscribeMessage("room-set-owner")
	public setOwner(
		@ConnectedSocket() socket: Socket,
		@MessageBody("roomId") roomId: string,
		@MessageBody("ownerId") ownerId: string
	) {
		const client = this.getClientById(socket.id);
		if (!client) {
			return;
		}
		const room = this.getRoomById(roomId);
		if (!room) {
			socket.emit("error", "Could not find room.");
			return;
		}
		if (!room.isOwner(client.id)) {
			return;
		}
		room.setOwner(ownerId);
	}

	@SubscribeMessage("room-set-lives")
	public setLives(
		@ConnectedSocket() socket: Socket,
		@MessageBody("roomId") roomId: string,
		@MessageBody("lives") lives: number
	) {
		const client = this.getClientById(socket.id);
		if (!client) {
			return;
		}
		const room = this.getRoomById(roomId);
		if (!room) {
			socket.emit("error", "Could not find room.");
			return;
		}
		if (!room.hasPlayer(socket.id) || !room.isOwner(socket.id)) {
			return;
		}
		room.setLives(lives);
	}

	@SubscribeMessage("room-message-new")
	public sendMessage(
		@ConnectedSocket() socket: Socket,
		@MessageBody("roomId") roomId: string,
		@MessageBody("content") content: string
	) {
		const client = this.getClientById(socket.id);
		if (!client) {
			return;
		}
		const room = this.getRoomById(roomId);
		if (!room) {
			socket.emit("error", "Could not find room.");
			return;
		}
		if (!room.hasPlayer(socket.id)) {
			return;
		}
		room.sendMessage({ authorId: socket.id, content, name: client.name });
	}

	@SubscribeMessage("room-change-difficulty")
	public changeDifficulty(
		@ConnectedSocket() socket: Socket,
		@MessageBody("roomId") roomId: string,
		@MessageBody("difficulty") difficulty: Difficulty
	) {
		const room = this.getRoomById(roomId);
		if (!room) {
			socket.emit("error", "Could not find room.");
			return;
		}
		if (!room.hasPlayer(socket.id) || !room.isOwner(socket.id)) {
			return;
		}
		room.changeLobbyDifficulty(difficulty);
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
		socket.emit("room-update", room.dto());
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
