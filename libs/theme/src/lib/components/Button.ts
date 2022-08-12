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
			outlineOffset: 2,
			outlineWidth: 4,
			outlineColor: "blue.300",
		},
	},
	sizes: {
		md: {
			borderWidth: 3,
		},
		lg: {
			borderWidth: 3,
		},
		xl: {
			borderWidth: 5,
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
			borderColor: "blue.900",
			boxShadow: "md",
			_hover: {
				textDecor: "none",
				bgColor: "gray.100",
			},
			_active: {
				bgColor: "gray.100",
			},
		},
	},
};
