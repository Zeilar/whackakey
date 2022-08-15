import { ButtonProps } from "@chakra-ui/react";
import { StyleConfig } from "@chakra-ui/theme-tools";

const key: ButtonProps = {
	borderWidth: "0.25em",
	borderColor: "gray.300",
	boxShadow: "var(--chakra-shadows-lg), 0 0 5px 0 inset rgba(0, 0, 0, 0.1)",
	bgColor: "gray.100",
	fontFamily: "Fredoka One, sans-serif",
	textTransform: "uppercase",
	rounded: 4,
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
			outlineWidth: 2,
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
			bgColor: "gray.100",
			_hover: {
				textDecor: "none",
				bgColor: "gray.50",
			},
			_active: {
				bgColor: "gray.200",
			},
		},
	},
};
