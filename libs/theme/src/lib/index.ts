import { extendTheme } from "@chakra-ui/react";
import * as components from "./components";
import { config } from "./config";
import { fonts } from "./fonts";
import { styles } from "./styles";

const theme = extendTheme({
	config,
	fonts,
	components: {
		...components, // This needs to be spread into a new object, no idea why
	},
	styles,
});

export default theme;
