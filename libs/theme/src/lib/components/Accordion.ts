import { StyleConfig } from "@chakra-ui/theme-tools";

export const Accordion: StyleConfig = {
	variants: {
		solid: {
			container: {
				border: 0,
			},
			button: {
				rounded: "lg",
				bgColor: "gray.700",
				_hover: {
					bgColor: "gray.600",
				},
				_focusVisible: {
					bgColor: "gray.600",
				},
			},
			panel: {
				rounded: "lg",
				bgColor: "gray.700",
				mt: 1,
				p: 4,
			},
		},
	},
};
