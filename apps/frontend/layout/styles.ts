import { CSSObject } from "@chakra-ui/react";

export const scrollbar: CSSObject = {
	overflow: "overlay",
	"&::-webkit-scrollbar": { width: 4 },
	"&::-webkit-scrollbar-thumb": {
		transition: "2s",
		border: "3px solid transparent",
		rounded: 100,
		bgColor: "inherit",
		bgClip: "padding-box",
	},
};
