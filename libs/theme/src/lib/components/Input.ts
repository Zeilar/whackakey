import { StyleConfig } from "@chakra-ui/theme-tools";

export const Input: StyleConfig = {
	variants: {
		filled: {
			field: {
				bgColor: "gray.600",
				borderColor: "border",
				rounded: "base",
				_placeholder: {
					userSelect: "none",
				},
				_hover: {
					borderColor: "border",
					bgColor: "gray.600",
				},
				_focusVisible: {
					borderColor: "accent",
					bgColor: "gray.600",
				},
				_invalid: {
					borderColor: "red.400",
					_focusVisible: {
						borderColor: "red.400",
					},
				},
			},
		},
	},
};
