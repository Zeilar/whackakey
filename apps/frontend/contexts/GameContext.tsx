import { createContext } from "react";
import { SoloGame, useSoloGame } from "../hooks";

export interface IGameContext {
	solo: SoloGame;
	multiplayer: any;
}

interface GameProps {
	children: React.ReactNode;
}

export const GameContext = createContext({} as IGameContext);

export function GameContextProvider({ children }: GameProps) {
	const solo = useSoloGame();

	const values: IGameContext = {
		solo,
		multiplayer: {},
	};

	return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
}
