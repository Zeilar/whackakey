import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { SoundFileName, sounds } from "../types/sound";

interface SoundContext {
	isMuted: boolean;
	volume: number;
	hasLoadedSounds: boolean;
	progress: number;
	toggle(): void;
	stopAll(): void;
	playAudio(path: SoundFileName): void;
	stopAudio(path: SoundFileName): void;
}

interface SoundProps {
	children: React.ReactNode;
}

type AudioState = Record<SoundFileName, HTMLAudioElement>;

export const SoundContext = createContext({} as SoundContext);

const DEFAULT_VOLUME = 0.1;
const soundKeys = Object.keys(sounds) as SoundFileName[];

export function SoundContextProvider({ children }: SoundProps) {
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolume] = useState(DEFAULT_VOLUME);
	const [audioFiles, setAudioFiles] = useState<AudioState>({} as AudioState);
	const audioFilesLength = useMemo(() => Object.keys(audioFiles).length, [audioFiles]);
	const hasLoadedSounds = useMemo(() => audioFilesLength >= soundKeys.length, [audioFilesLength]);
	const progress = useMemo(() => (audioFilesLength / soundKeys.length) * 100, [audioFilesLength]);

	useEffect(() => {
		setVolume(isMuted ? 0 : DEFAULT_VOLUME);
	}, [isMuted]);

	useEffect(() => {
		soundKeys.forEach(sound => {
			const file = audioFiles[sound];
			if (!file) {
				return;
			}
			file.volume = volume;
		});
	}, [volume, audioFiles]);

	useEffect(() => {
		soundKeys.forEach(sound => {
			const audio = new Audio(`/assets/sound/${sound}.wav`);
			audio.volume = DEFAULT_VOLUME;
			audio.addEventListener("loadeddata", () => {
				setAudioFiles(p => ({ ...p, [sound]: audio }));
			});
		});
	}, []);

	function toggle() {
		setIsMuted(p => !p);
	}

	const stopAll = useCallback(() => {
		for (const property in audioFiles) {
			const file = audioFiles[property as SoundFileName];
			if (!file.paused) {
				file.pause();
			}
			file.currentTime = 0;
		}
	}, [audioFiles]);

	const playAudio = useCallback(
		(path: SoundFileName) => {
			audioFiles[path].play();
		},
		[audioFiles]
	);

	const stopAudio = useCallback(
		(path: SoundFileName) => {
			audioFiles[path].pause();
			audioFiles[path].currentTime = 0;
		},
		[audioFiles]
	);

	const values: SoundContext = {
		isMuted,
		toggle,
		volume,
		playAudio,
		hasLoadedSounds,
		progress,
		stopAudio,
		stopAll,
	};

	return <SoundContext.Provider value={values}>{children}</SoundContext.Provider>;
}
