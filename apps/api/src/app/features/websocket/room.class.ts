import { Server } from "socket.io";
import { Client } from "../../../types/ws";
import {
	MAX_PLAYERS,
	PlayerJoinDto,
	PlayerLeaveDto,
	RoomDto,
	alphabets,
	DifficultyTiming,
	Difficulty,
	Player,
} from "@shared";

const alphabet = alphabets.english;

const difficultiesMap: Record<Difficulty, DifficultyTiming> = {
	easy: DifficultyTiming.EASY,
	medium: DifficultyTiming.MEDIUM,
	hard: DifficultyTiming.HARD,
};

export class Room {
	private ownerId: string;
	public players: Player[] = [];
	public isGameActive = false;
	private difficulty: Difficulty = "easy";
	private interval: NodeJS.Timer;
	private letter = this.randomLetter();

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
			letter: this.letter,
			difficulty: this.difficulty,
		};
	}

	public setDifficulty(difficulty: Difficulty) {
		this.difficulty = difficulty;
	}

	private snapshot() {
		return this.players;
	}

	private randomLetter(): string {
		const letter = alphabet[Math.floor(alphabet.length * Math.random())];
		return letter !== this.letter ? letter : this.randomLetter();
	}

	public hasPlayer(clientId: string) {
		return this.players.some(player => player.id === clientId);
	}

	public makePlayer(client: Client) {
		if (this.isGameActive || this.players.length >= MAX_PLAYERS) {
			return;
		}
		const player: Player = {
			...client,
			isEliminated: false,
			lives: 3,
			wins: 0,
			pick: null,
		};
		this.players.push(player);
		this.server.emit("room-player-join", { player, roomId: this.id } as PlayerJoinDto);
	}

	public removePlayer(clientId: string) {
		this.players = this.players.filter(player => player.id !== clientId);
		this.server.emit("room-player-leave", { playerId: clientId, roomId: this.id } as PlayerLeaveDto);
		this.update();
	}

	private attemptWinner() {
		if (this.playersLeft() <= 1) {
			const winner = this.players.find(player => player.isEliminated === false);
			if (!winner) {
				this.server.to(this.id).emit("error", "Could not find winner.");
				return false;
			}
			winner.wins++;
			this.server.to(this.id).emit("winner", winner.id);
			this.reset();
			return true;
		}
		return false;
	}

	private update() {
		if (!this.isGameActive) {
			clearInterval(this.interval);
			return;
		}
		this.players.forEach(player => {
			if (player.pick != null && player.pick === this.letter) {
				return;
			}
			if (player.lives <= 1) {
				player.isEliminated = true;
			}
			player.lives--;
		});
		this.letter = this.randomLetter();
		console.log(this.letter);
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

	private playersLeft() {
		return this.players.reduce((total, player) => (!player.isEliminated ? total + 1 : total), 0);
	}

	private get difficultyInMs() {
		return difficultiesMap[this.difficulty];
	}

	public start() {
		setTimeout(() => {
			if (this.players.length < 2 || this.isGameActive) {
				return;
			}
			this.reset();
			this.isGameActive = true;
			this.server.emit("room-game-active", this.id);
			setTimeout(() => {
				this.interval = setInterval(() => {
					if (this.attemptWinner()) {
						clearInterval(this.interval);
						return;
					}
					this.update();
				}, this.difficultyInMs);
			}, this.difficultyInMs);
		}, 3000);
	}

	public isOwner(id: string) {
		return id === this.ownerId;
	}

	private setOwner(ownerId: string) {
		if (!this.players.some(player => player.id === ownerId)) {
			return;
		}
		this.ownerId = ownerId;
		this.server.to(this.id).emit("room-new-owner", this.ownerId);
	}
}
