import { StyleConfig } from "@chakra-ui/theme-tools";

export const Tabs: StyleConfig = {
	variants: {
		line: {
			tab: {
				userSelect: "none",
				fontWeight: 600,
				transition: "none",
				color: "border",
				_hover: {
					borderColor: "border",
					color: "gray.500",
				},
				_selected: {
					color: "blue.500",
					_hover: {
						color: "blue.500",
						borderColor: "blue.500",
					},
				},
				_active: {
					bg: "none",
				},
			},
			tabpanel: {
				px: 0,
			},
		},
	},
};
