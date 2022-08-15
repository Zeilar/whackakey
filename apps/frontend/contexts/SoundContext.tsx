import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { SoundFileName, sounds } from "../types/sound";

interface SoundContext {
	isMuted: boolean;
	toggle(): void;
	volume: number;
	playAudio(path: string): void;
	hasLoadedSounds: boolean;
	progress: number;
}

interface SoundProps {
	children: React.ReactNode;
}

export const SoundContext = createContext({} as SoundContext);

const DEFAULT_VOLUME = 0.1;

const soundKeys = Object.keys(sounds);

export function SoundContextProvider({ children }: SoundProps) {
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolume] = useState(DEFAULT_VOLUME);
	const [loadedSounds, setLoadedSounds] = useState(0);
	const hasLoadedSounds = useMemo(() => loadedSounds >= soundKeys.length, [loadedSounds]);
	const progress = useMemo(() => (loadedSounds / soundKeys.length) * 100, [loadedSounds]);

	useEffect(() => {
		setVolume(isMuted ? 0 : DEFAULT_VOLUME);
	}, [isMuted]);

	useEffect(() => {
		soundKeys.forEach(sound => {
			const audio = new Audio(`/assets/sound/${sound}.wav`);
			audio.addEventListener("loadeddata", () => {
				setLoadedSounds(p => p + 1);
			});
		});
	}, []);

	function toggle() {
		setIsMuted(p => !p);
	}

	const playAudio = useCallback(
		(path: SoundFileName) => {
			if (isMuted) {
				return;
			}
			const audio = new Audio(`/assets/sound/${path}.wav`);
			audio.volume = volume;
			audio.play();
		},
		[isMuted, volume]
	);

	const values: SoundContext = {
		isMuted,
		toggle,
		volume,
		playAudio,
		hasLoadedSounds,
		progress,
	};

	return <SoundContext.Provider value={values}>{children}</SoundContext.Provider>;
}
