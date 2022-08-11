import { useContext } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

export default function useWebsocketContext() {
	return useContext(WebsocketContext);
}
