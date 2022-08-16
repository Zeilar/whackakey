import { Difficulty, Message, Player, RoomDto } from "@shared";

export enum RoomActions {
	ADD = "add",
	REMOVE = "remove",
	PLAYER_LEAVE = "player-leave",
	PLAYER_JOIN = "player-join",
	SNAPSHOT = "snapshot",
	EMPTY = "empty",
	GET_ALL = "get-all",
	START = "start",
	END = "end",
	NEW_OWNER = "new-owner",
	CHANGE_DIFFICULTY = "change-difficulty",
	NEW_MESSAGE = "new-message",
	SET_LIVES = "set-lives",
}

export type RoomAction =
	| AddAction
	| RemoveAction
	| PlayerJoinAction
	| PlayerLeaveAction
	| SnapshotAction
	| EmptyAction
	| GetAllAction
	| StartAction
	| EndAction
	| NewOwnerAction
	| ChangeDifficultyAction
	| NewMessageAction
	| SetLivesAction;

interface SetLivesAction {
	type: RoomActions.SET_LIVES;
	roomId: string;
	lives: number;
}

interface NewMessageAction {
	type: RoomActions.NEW_MESSAGE;
	roomId: string;
	message: Message;
}

interface ChangeDifficultyAction {
	type: RoomActions.CHANGE_DIFFICULTY;
	roomId: string;
	difficulty: Difficulty;
}

interface NewOwnerAction {
	type: RoomActions.NEW_OWNER;
	roomId: string;
	ownerId: string;
}

interface StartAction {
	type: RoomActions.START;
	roomId: string;
}

interface EndAction {
	type: RoomActions.END;
	roomId: string;
}

interface AddAction {
	type: RoomActions.ADD;
	room: RoomDto;
}

interface RemoveAction {
	type: RoomActions.REMOVE;
	roomId: string;
}

interface PlayerJoinAction {
	type: RoomActions.PLAYER_JOIN;
	roomId: string;
	player: Player;
}

interface PlayerLeaveAction {
	type: RoomActions.PLAYER_LEAVE;
	roomId: string;
	playerId: string;
}

interface SnapshotAction {
	type: RoomActions.SNAPSHOT;
	room: RoomDto;
}

interface EmptyAction {
	type: RoomActions.EMPTY;
}

interface GetAllAction {
	type: RoomActions.GET_ALL;
	rooms: RoomDto[];
}

export function roomReducer(state: RoomDto[], action: RoomAction) {
	switch (action.type) {
		case RoomActions.ADD:
			return [...state, action.room];
		case RoomActions.REMOVE:
			return state.filter(room => room.id !== action.roomId);
		case RoomActions.PLAYER_JOIN:
			return state.map(room =>
				action.roomId === room.id
					? {
							...room,
							players: [...room.players, action.player],
					  }
					: room
			);
		case RoomActions.PLAYER_LEAVE:
			return state.map(room =>
				action.roomId === room.id
					? {
							...room,
							players: room.players.filter(player => player.id !== action.playerId),
					  }
					: room
			);
		case RoomActions.SNAPSHOT:
			return state.map(room => (action.room.id === room.id ? { ...action.room } : room));
		case RoomActions.EMPTY:
			return [];
		case RoomActions.GET_ALL:
			return [...action.rooms];
		case RoomActions.START:
			return state.map(room => (action.roomId === room.id ? { ...room, isGameActive: true } : room));
		case RoomActions.END:
			return state.map(room => (action.roomId === room.id ? { ...room, isGameActive: false } : room));
		case RoomActions.NEW_OWNER:
			return state.map(room => (action.roomId === room.id ? { ...room, ownerId: action.ownerId } : room));
		case RoomActions.CHANGE_DIFFICULTY:
			return state.map(room => (action.roomId === room.id ? { ...room, difficulty: action.difficulty } : room));
		case RoomActions.NEW_MESSAGE:
			return state.map(room =>
				action.roomId === room.id ? { ...room, messages: [...room.messages, action.message] } : room
			);
		case RoomActions.SET_LIVES:
			return state.map(room => (action.roomId === room.id ? { ...room, lives: action.lives } : room));
		default:
			return state;
	}
}
