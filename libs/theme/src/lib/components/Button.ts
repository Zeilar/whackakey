import { ButtonProps } from "@chakra-ui/react";
import { StyleConfig } from "@chakra-ui/theme-tools";

const key: ButtonProps = {
	borderWidth: 5,
	borderColor: "blackAlpha.300",
	boxShadow: "var(--chakra-shadows-lg), 0 0 5px 0 inset rgba(0, 0, 0, 0.1)",
	bgColor: "whiteAlpha.900",
	fontFamily: "Fredoka One, sans-serif",
	textTransform: "uppercase",
	rounded: "xl",
	_hover: {
		bgColor: "whiteAlpha.800",
	},
	_active: {},
};

export const Button: StyleConfig = {
	baseStyle: {
		color: "gray.700",
		fontWeight: 500,
		_focusVisible: {
			boxShadow: "none",
		},
		_focus: {
			outlineOffset: 4,
			outlineWidth: 4,
			outlineColor: "blue.300",
		},
	},
	sizes: {
		xl: {
			fontSize: "4xl",
			py: 6,
			px: 20,
		},
	},
	variants: {
		key,
		solid: {
			fontFamily: "Fredoka One, sans-serif",
			textTransform: "uppercase",
			borderRadius: "full",
			borderWidth: 6,
			borderColor: "blue.900",
			boxShadow: "mg",
			_hover: {
				textDecor: "none",
			},
			_active: {},
		},
	},
};
