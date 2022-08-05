import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

export default function useGameContext() {
	return useContext(GameContext);
}
