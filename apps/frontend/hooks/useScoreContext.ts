import { useContext } from "react";
import { ScoreContext } from "../contexts/ScoreContext";

export default function useScoreContext() {
	return useContext(ScoreContext);
}
