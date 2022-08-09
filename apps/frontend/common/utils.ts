import { alphabet } from "./constants";

export function randomUniqueLetter(currentLetter: string | null) {
	const newLetter = alphabet[Math.floor(alphabet.length * Math.random())];
	if (newLetter === currentLetter) {
		randomUniqueLetter(currentLetter);
	}
	return newLetter;
}
