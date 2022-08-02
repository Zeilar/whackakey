import { useContext } from "react";
import { LetterContext } from "../contexts/LetterContext";

export default function useLetterContext() {
	return useContext(LetterContext);
}
