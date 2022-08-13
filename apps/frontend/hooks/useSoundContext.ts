import { useContext } from "react";
import { SoundContext } from "../contexts/SoundContext";

export function useSoundContext() {
	return useContext(SoundContext);
}
