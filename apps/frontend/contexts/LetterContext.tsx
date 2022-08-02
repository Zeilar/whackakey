import { createContext, useState } from "react";

interface LetterContext {
	letter: string | null;
	setLetter: React.Dispatch<React.SetStateAction<string | null>>;
	isLocked: boolean;
	setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LetterProps {
	children: React.ReactNode;
}

export const LetterContext = createContext({} as LetterContext);

export function LetterContextProvider({ children }: LetterProps) {
	const [isLocked, setIsLocked] = useState(false);
	const [letter, setLetter] = useState<string | null>(null);

	const values: LetterContext = {
		letter,
		setLetter,
		isLocked,
		setIsLocked,
	};

	return <LetterContext.Provider value={values}>{children}</LetterContext.Provider>;
}
