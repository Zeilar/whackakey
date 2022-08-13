import { createContext } from "react";
import { SoloGame, useSoloGame } from "../hooks";

interface GameProps {
	children: React.ReactNode;
}

export const SoloGameContext = createContext({} as SoloGame);

export function SoloGameContextProvider({ children }: GameProps) {
	const solo = useSoloGame();
	return <SoloGameContext.Provider value={solo}>{children}</SoloGameContext.Provider>;
}
