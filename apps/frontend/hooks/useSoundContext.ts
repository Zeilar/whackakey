import { useContext } from "react";
import { SoundContext } from "../contexts/SoundContext";

export default function useSoundContext() {
	return useContext(SoundContext);
}
