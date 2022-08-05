import { StyleConfig } from "@chakra-ui/theme-tools";

export const Textarea: StyleConfig = {
	variants: {
		filled: {
			bgColor: "gray.600",
			borderColor: "border",
			rounded: "base",
			_placeholder: {
				userSelect: "none",
			},
			_hover: {
				bgColor: "gray.600",
				borderColor: "border",
			},
			_focusVisible: {
				bgColor: "gray.600",
				borderColor: "accent",
			},
			_invalid: {
				borderColor: "red.400",
				_focusVisible: {
					borderColor: "red.400",
				},
			},
		},
	},
};
