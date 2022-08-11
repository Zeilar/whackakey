import { Server } from "socket.io";
import { Client } from "../../../types/ws";
import { MAX_PLAYERS, PlayerJoinDto, PlayerLeaveDto, RoomDto } from "@shared";

interface Player {
	name: string;
	id: string;
	lives: number;
	isEliminated: boolean;
	wins: number;
}

export class Room {
	private ownerId: string;
	public players: Player[] = [];
	public isGameActive = false;

	public constructor(private readonly server: Server, owner: Client, public readonly id: string) {
		this.ownerId = owner.id;
		this.makePlayer(owner);
	}

	public dto(): RoomDto {
		return {
			id: this.id,
			players: this.players,
			isGameActive: this.isGameActive,
			ownerId: this.ownerId,
		};
	}

	private snapshot() {
		return this.players;
	}

	public hasPlayer(clientId: string) {
		return this.players.some(player => player.id === clientId);
	}

	public makePlayer(client: Client) {
		if (this.isGameActive || this.players.length >= MAX_PLAYERS) {
			return;
		}
		const player = {
			...client,
			isEliminated: false,
			lives: 3,
			wins: 0,
		};
		this.players.push(player);
		this.server.emit("room-player-join", { player, roomId: this.id } as PlayerJoinDto);
	}

	public removePlayer(clientId: string) {
		this.players = this.players.filter(player => player.id !== clientId);
		this.server.emit("room-player-leave", { playerId: clientId, roomId: this.id } as PlayerLeaveDto);
		this.update();
	}

	private update() {
		if (!this.isGameActive) {
			return;
		}
		if (this.playersLeft() <= 1) {
			const winner = this.players.find(player => player.isEliminated === false);
			if (!winner) {
				this.server.to(this.id).emit("error", "Could not find winner.");
				return;
			}
			winner.wins++;
			this.server.to(this.id).emit("winner", winner.id);
			this.reset();
			return;
		}
		this.server.to(this.id).emit("update", this.snapshot());
	}

	public isEmpty() {
		return this.players.length === 0;
	}

	private reset() {
		this.players.forEach(player => {
			player.lives = 3;
			player.isEliminated = false;
		});
		this.server.to(this.id).emit("update", this.snapshot());
		this.server.emit("room-game-inactive", this.id);
	}

	public subtractLife(playerId: string) {
		const player = this.getPlayerById(playerId);
		if (!player) {
			return;
		}
		if (player.lives <= 0) {
			player.isEliminated = true;
			return;
		}
		player.lives--;
	}

	private getPlayerById(id: string) {
		return this.players.find(player => player.id === id);
	}

	private playersLeft() {
		return this.players.reduce((total, player) => (!player.isEliminated ? total + 1 : total), 0);
	}

	public start() {
		setTimeout(() => {
			if (this.players.length < 2 || this.isGameActive) {
				return;
			}
			this.reset();
			this.isGameActive = true;
			this.server.to(this.id).emit("start", this.snapshot());
			this.server.emit("room-game-active", this.id);
		}, 3000);
	}

	public isOwner(id: string) {
		return id === this.ownerId;
	}

	private setOwner(ownerId: string) {
		if (!this.players.some(player => player.id === ownerId)) {
			this.ownerId = this.players[0].id;
			return;
		}
		this.ownerId = ownerId;
		this.server.to(this.id).emit("room-new-owner", this.ownerId);
	}
}
