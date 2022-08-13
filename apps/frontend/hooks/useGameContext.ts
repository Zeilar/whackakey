import { useContext } from "react";
import { IGameContext, GameContext } from "../contexts/GameContext";
import { Mode } from "../types/game";

export function useGameContext<T extends Mode>(mode: Mode): IGameContext[T] {
	const context = useContext(GameContext);
	return context[mode];
}
