import { Difficulty, Player } from "./game";

export interface RoomDto {
	id: string;
	name: string;
	isGameActive: boolean;
	ownerId: string;
	players: Player[];
	letter: string | null;
	difficulty: Difficulty;
}

export interface PlayerJoinDto {
	roomId: string;
	player: Player;
}

export interface PlayerLeaveDto {
	roomId: string;
	playerId: string;
}

export interface NewOwnerDto {
	roomId: string;
	ownerId: string;
}

export interface ChangeDifficultyDto {
	roomId: string;
	difficulty: Difficulty;
}
