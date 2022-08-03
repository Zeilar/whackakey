import { soundEffectVolume } from "./config";

export function playAudio(path: string) {
	const audio = new Audio(`/assets/sound/${path}.wav`);
	audio.volume = soundEffectVolume;
	audio.play();
}
