import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import * as components from "./components";
import { config } from "./config";
import { fonts } from "./fonts";
import { styles } from "./styles";
import { textStyles } from "./textStyles";

const theme = extendTheme({
	config,
	fonts,
	colors,
	components: {
		...components, // This needs to be spread into a new object, no idea why
	},
	styles,
	textStyles,
});

export default theme;
