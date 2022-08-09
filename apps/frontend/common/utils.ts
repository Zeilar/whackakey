import { alphabet } from "./constants";

export function randomUniqueLetter(currentLetter: string | null): string {
	const newLetter = alphabet[Math.floor(alphabet.length * Math.random())];
	return newLetter !== currentLetter ? newLetter : randomUniqueLetter(currentLetter);
}
