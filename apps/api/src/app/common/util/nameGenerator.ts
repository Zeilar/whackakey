import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator";

export function randomName() {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, animals],
		separator: " ",
		style: "capital",
		length: 2,
	});
}
