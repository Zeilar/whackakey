import { Difficulty, Player } from "./game";
import { Message } from "./room";

export interface RoomDto {
	id: string;
	name: string;
	isGameActive: boolean;
	ownerId: string;
	players: Player[];
	letter: string | null;
	difficulty: Difficulty;
	messages: Message[];
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

export interface NewMessageDto {
	roomId: string;
	message: Message;
}

export interface SendMessageDto {
	roomId: string;
	content: string;
}
