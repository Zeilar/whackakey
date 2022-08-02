import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { LetterContextProvider } from "../contexts/LetterContext";
import { ScoreContextProvider } from "../contexts/ScoreContext";

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Welcome to frontend!</title>
			</Head>
			<ChakraProvider>
				<LetterContextProvider>
					<ScoreContextProvider>
						<CSSReset />
						<main>
							<Component {...pageProps} />
						</main>
					</ScoreContextProvider>
				</LetterContextProvider>
			</ChakraProvider>
		</>
	);
}

export default CustomApp;
