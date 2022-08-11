import { Player } from "./game";

export interface RoomDto {
	id: string;
	isGameActive: boolean;
	ownerId: string;
	players: Player[];
}

export interface PlayerJoinDto {
	roomId: string;
	player: Player;
}

export interface PlayerLeaveDto {
	roomId: string;
	playerId: string;
}
