import { Server } from "socket.io";
import { Client } from "../../../types/ws";
import {
	MAX_PLAYERS,
	PlayerJoinDto,
	PlayerLeaveDto,
	RoomDto,
	alphabets,
	Difficulty,
	Player,
	NewOwnerDto,
	difficultyInMs,
	ChangeDifficultyDto,
	Message,
	NewMessageDto,
	DEFAULT_LIVES,
	SetLivesDto,
	ENRAGE_THRESHOLD_MEDIUM,
	ENRAGE_THRESHOLD_HARD,
} from "@shared";
import { randomName } from "../../common/util/nameGenerator";
import { v4 as uuidv4 } from "uuid";

const alphabet = alphabets.english;

export class Room {
	private ownerId: string;
	private name: string;
	public players: Player[] = [];
	public isGameActive = false;
	private difficulty: Difficulty = "easy";
	private lobbyDifficulty: Difficulty = "easy";
	private interval: NodeJS.Timer;
	private timeout: NodeJS.Timer;
	private letter: string | null = null;
	private messages: Message[] = [];
	private lives = DEFAULT_LIVES;
	private elapsedRounds = 0;

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
			messages: this.messages,
			lives: this.lives,
		};
	}

	public setLives(lives: number) {
		this.lives = lives;
		this.server.to(this.id).emit("room-set-lives", { roomId: this.id, lives } as SetLivesDto);
		this.players.forEach(player => {
			player.lives = this.lives;
		});
	}

	private endGame() {
		this.isGameActive = false;
		this.server.emit("room-inactive", this.id);
	}

	private startGame() {
		this.isGameActive = true;
		this.server.emit("room-active", this.id);
	}

	private raiseDifficulty() {
		if (this.difficulty === "hard") {
			return;
		}
		switch (this.difficulty) {
			case "easy":
				this.changeDifficulty("medium");
				break;
			case "medium":
				this.changeDifficulty("hard");
				break;
		}
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.update();
			this.attemptWinner();
		}, difficultyInMs(this.difficulty));
	}

	public sendMessage(data: Omit<Message, "id">) {
		const message: Message = {
			id: uuidv4(),
			...data,
		};
		this.messages.push(message);
		this.server.to(this.id).emit("room-message-new", { roomId: this.id, message } as NewMessageDto);
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
			lives: this.lives,
			wins: 0,
			pick: null,
		};
		this.players.push(player);
		this.server.emit("room-player-join", { player, roomId: this.id } as PlayerJoinDto);
	}

	public removePlayer(clientId: string) {
		if (this.players.length === 0) {
			return;
		}
		this.players = this.players.filter(player => player.id !== clientId);
		if (clientId === this.ownerId && this.players.length > 0) {
			this.setOwner(this.players[0].id);
		}
		this.server.emit("room-player-leave", { playerId: clientId, roomId: this.id } as PlayerLeaveDto);
		if (!this.isGameActive) {
			return;
		}
		this.attemptWinner();
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
		if (winner) {
			winner.wins++;
			this.server.to(this.id).emit("winner", winner.name);
		} else {
			this.server.to(this.id).emit("tie");
		}
		this.reset();
	}

	private update() {
		if (!this.isGameActive) {
			clearInterval(this.interval);
			return;
		}
		this.players.forEach(player => {
			if (player.lives <= 0) {
				player.isEliminated = true;
			}
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
		if (this.playersLeft() === 0) {
			this.attemptWinner();
			return;
		}
		this.elapsedRounds++;
		if (this.elapsedRounds === ENRAGE_THRESHOLD_MEDIUM || this.elapsedRounds === ENRAGE_THRESHOLD_HARD) {
			this.raiseDifficulty();
		}
		this.newRound();
	}

	private newRound() {
		if (this.playersLeft() > 0) {
			this.letter = this.randomLetter();
		}
		this.updateEmit();
	}

	public isEmpty() {
		return this.players.length === 0;
	}

	public updateEmit() {
		this.server.to(this.id).emit("room-update", this.dto());
	}

	private reset() {
		this.players.forEach(player => {
			player.lives = this.lives;
			player.isEliminated = false;
			player.pick = null;
		});
		this.endGame();
		this.letter = null;
		this.elapsedRounds = 0;
		this.difficulty = this.lobbyDifficulty;
		this.updateEmit();
	}

	private playersLeft() {
		return this.players.reduce((total, player) => (!player.isEliminated ? total + 1 : total), 0);
	}

	public changeLobbyDifficulty(difficulty: Difficulty) {
		this.lobbyDifficulty = difficulty;
		this.difficulty = difficulty;
		this.server.to(this.id).emit("room-change-difficulty", { roomId: this.id, difficulty } as ChangeDifficultyDto);
	}

	public changeDifficulty(difficulty: Difficulty) {
		this.difficulty = difficulty;
		this.server.to(this.id).emit("room-change-difficulty", { roomId: this.id, difficulty } as ChangeDifficultyDto);
	}

	public playerPick(clientId: string, letter: string) {
		const player = this.getPlayer(clientId);
		if (!player) {
			return;
		}
		player.pick = letter;
		this.updateEmit();
	}

	public start() {
		if (this.players.length < 2 || this.isGameActive) {
			return;
		}
		this.server.to(this.id).emit("game-starting", Date.now() + 3000);
		this.timeout = setTimeout(() => {
			this.startGame();
			this.attemptWinner();
			this.newRound();
			this.interval = setInterval(() => {
				this.update();
				this.attemptWinner();
			}, difficultyInMs(this.difficulty));
		}, 3000);
	}

	public isOwner(clientId: string) {
		return clientId === this.ownerId;
	}

	public setOwner(ownerId: string) {
		if (!this.hasPlayer(ownerId)) {
			return;
		}
		this.ownerId = ownerId;
		this.server.to(this.id).emit("room-new-owner", { roomId: this.id, ownerId } as NewOwnerDto);
	}
}
