import { Difficulty, Player } from "./game";

export interface RoomDto {
	id: string;
	isGameActive: boolean;
	ownerId: string;
	players: Player[];
	letter: string;
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
