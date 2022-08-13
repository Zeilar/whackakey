import { useContext } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

export function useWebsocketContext() {
	return useContext(WebsocketContext);
}
