import { createContext, useEffect, useState } from "react";

interface SoundContext {
	isMuted: boolean;
	toggle(): void;
	volume: number;
	playAudio(path: string): void;
}

interface SoundProps {
	children: React.ReactNode;
}

export const SoundContext = createContext({} as SoundContext);

const DEFAULT_VOLUME = 0.35;

export function SoundContextProvider({ children }: SoundProps) {
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolume] = useState(DEFAULT_VOLUME);

	useEffect(() => {
		setVolume(isMuted ? 0 : DEFAULT_VOLUME);
	}, [isMuted]);

	function toggle() {
		setIsMuted(p => !p);
	}

	function playAudio(path: string) {
		if (isMuted) {
			return;
		}
		const audio = new Audio(`/assets/sound/${path}.wav`);
		audio.volume = volume;
		audio.play();
	}

	const values: SoundContext = {
		isMuted,
		toggle,
		volume,
		playAudio,
	};

	return <SoundContext.Provider value={values}>{children}</SoundContext.Provider>;
}
