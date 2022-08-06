import "../common/fonts";
import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, CSSReset, Flex } from "@chakra-ui/react";
import { SoundContextProvider } from "../contexts/SoundContext";
import theme from "@theme";
import { GameContextProvider } from "../contexts/GameContext";
import Header from "../components/Header";

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Whack a key</title>
			</Head>
			<ChakraProvider theme={theme}>
				<CSSReset />
				<SoundContextProvider>
					<GameContextProvider>
						<Flex
							h="100%"
							justifyContent="center"
							alignItems="center"
							bgImg="radial-gradient(circle, transparent 25%, var(--chakra-colors-blue-700) 26%),linear-gradient(0deg, transparent 44%, var(--chakra-colors-blue-900) 45%, var(--chakra-colors-blue-900) 55%, transparent 56%), linear-gradient(90deg, transparent 44%, var(--chakra-colors-blue-900) 45%, var(--chakra-colors-blue-900) 55%, transparent 56%)"
							bgColor="blue.700"
							bgSize="1.5em 1.5em"
						>
							<Header />
							<Component {...pageProps} />
						</Flex>
					</GameContextProvider>
				</SoundContextProvider>
			</ChakraProvider>
		</>
	);
}

export default CustomApp;
