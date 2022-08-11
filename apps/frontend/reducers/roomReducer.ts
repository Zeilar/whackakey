import { Player, RoomDto } from "@shared";

export enum RoomAction {
	ADD = "add",
	REMOVE = "remove",
	PLAYER_LEAVE = "player-leave",
	PLAYER_JOIN = "player-join",
	SNAPSHOT = "snapshot",
	EMPTY = "empty",
}

interface AddAction {
	type: RoomAction.ADD;
	room: RoomDto;
}

interface RemoveAction {
	type: RoomAction.REMOVE;
	roomId: string;
}

interface PlayerJoinAction {
	type: RoomAction.PLAYER_JOIN;
	roomId: string;
	player: Player;
}

interface PlayerLeaveAction {
	type: RoomAction.PLAYER_LEAVE;
	roomId: string;
	playerId: string;
}

interface SnapshotAction {
	type: RoomAction.SNAPSHOT;
	roomId: string;
	snapshot: RoomDto;
}

interface EmptyAction {
	type: RoomAction.EMPTY;
}

export function roomReducer(
	state: RoomDto[],
	action: AddAction | RemoveAction | PlayerJoinAction | PlayerLeaveAction | SnapshotAction | EmptyAction
) {
	switch (action.type) {
		case RoomAction.ADD:
			return [...state, action.room];
		case RoomAction.REMOVE:
			return state.filter(room => room.id !== action.roomId);
		case RoomAction.PLAYER_JOIN:
			return state.map(room =>
				action.roomId === room.id
					? {
							...room,
							players: [...room.players, action.player],
					  }
					: room
			);
		case RoomAction.PLAYER_LEAVE:
			return state.map(room =>
				action.roomId === room.id
					? {
							...room,
							players: room.players.filter(player => player.id !== action.playerId),
					  }
					: room
			);
		case RoomAction.SNAPSHOT:
			return state.map(room => (action.roomId === room.id ? { ...action.snapshot } : room));
		case RoomAction.EMPTY:
			return [];
		default:
			return state;
	}
}
