import { createContext, useState } from "react";

interface SoundContext {
	isMuted: boolean;
	toggle(): void;
}

interface SoundProps {
	children: React.ReactNode;
}

export const SoundContext = createContext({} as SoundContext);

export function SoundContextProvider({ children }: SoundProps) {
	const [isMuted, setIsMuted] = useState(false);

	function toggle() {
		setIsMuted(p => !p);
	}

	const values: SoundContext = {
		isMuted,
		toggle,
	};

	return <SoundContext.Provider value={values}>{children}</SoundContext.Provider>;
}
