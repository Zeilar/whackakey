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
import { randomName } from "../../common/util/nameGenerator";

const alphabet = alphabets.english;

const difficultiesMap: Record<Difficulty, DifficultyTiming> = {
	easy: DifficultyTiming.EASY,
	medium: DifficultyTiming.MEDIUM,
	hard: DifficultyTiming.HARD,
};

export class Room {
	private ownerId: string;
	private name: string;
	public players: Player[] = [];
	public isGameActive = false;
	private difficulty: Difficulty = "easy";
	private interval: NodeJS.Timer;
	private timeout: NodeJS.Timer;
	private letter: string | null = null;

	public constructor(private readonly server: Server, owner: Client, public readonly id: string) {
		this.ownerId = owner.id;
		this.makePlayer(owner);
		this.name = randomName();
	}

	public dto(): RoomDto {
		return {
			id: this.id,
			name: this.name,
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
		return this.dto();
	}

	private endGame() {
		this.isGameActive = false;
		this.server.emit("room-inactive", this.id);
	}

	private startGame() {
		this.isGameActive = true;
		this.server.emit("room-active", this.id);
	}

	private randomLetter(): string {
		const letter = alphabet[Math.floor(alphabet.length * Math.random())];
		return letter !== this.letter ? letter : this.randomLetter();
	}

	public hasPlayer(clientId: string) {
		return this.players.some(player => player.id === clientId);
	}

	public getPlayer(clientId: string) {
		return this.players.find(player => player.id === clientId);
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
		if (this.players.length === 0) {
			return;
		}
		if (clientId === this.ownerId) {
			this.setOwner(this.players[0].id);
		}
		this.server.emit("room-player-leave", { playerId: clientId, roomId: this.id } as PlayerLeaveDto);
		this.update();
	}

	public isFull() {
		return this.players.length >= MAX_PLAYERS;
	}

	private attemptWinner() {
		if (this.playersLeft() > 1) {
			return;
		}
		this.endGame();
		clearInterval(this.interval);
		clearTimeout(this.timeout);
		const winner = this.players.find(player => player.isEliminated === false);
		if (!winner) {
			this.server.to(this.id).emit("error", "Tie.");
			// this.server.to(this.id).emit("tie", this.snapshot());
			return;
		}
		winner.wins++;
		this.server.to(this.id).emit("winner", winner.id);
		this.reset();
	}

	private update() {
		if (!this.isGameActive) {
			clearInterval(this.interval);
			return;
		}
		this.players.forEach(player => {
			if (player.isEliminated) {
				return;
			}
			if (player.pick === null || player.pick !== this.letter) {
				if (player.lives > 0) {
					player.lives--;
				}
				if (player.lives <= 0) {
					player.isEliminated = true;
				}
			}
			player.pick = null;
		});
		this.newRound();
	}

	private newRound() {
		if (this.playersLeft() > 0) {
			this.letter = this.randomLetter();
		}
		this.server.to(this.id).emit("room-update", this.snapshot());
	}

	public isEmpty() {
		return this.players.length === 0;
	}

	private reset() {
		this.players.forEach(player => {
			player.lives = 3;
			player.isEliminated = false;
			player.pick = null;
		});
		this.endGame();
		this.letter = null;
		this.server.to(this.id).emit("room-update", this.snapshot());
	}

	private playersLeft() {
		return this.players.reduce((total, player) => (!player.isEliminated ? total + 1 : total), 0);
	}

	private get difficultyInMs() {
		return difficultiesMap[this.difficulty];
	}

	public playerPick(clientId: string, letter: string) {
		const player = this.getPlayer(clientId);
		if (!player) {
			return;
		}
		player.pick = letter;
	}

	public start() {
		if (this.players.length < 2 || this.isGameActive) {
			return;
		}
		this.reset();
		this.server.to(this.id).emit("game-starting", Date.now() + 3000);
		this.timeout = setTimeout(() => {
			this.startGame();
			this.attemptWinner();
			this.newRound();
			this.interval = setInterval(() => {
				this.attemptWinner();
				this.update();
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
