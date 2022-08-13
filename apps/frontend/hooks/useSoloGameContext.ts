import { useContext } from "react";
import { SoloGameContext } from "../contexts/SoloGameContext";

export function useSoloGameContext() {
	return useContext(SoloGameContext);
}
