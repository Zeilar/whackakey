import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { LetterContextProvider } from "../contexts/LetterContext";

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Welcome to frontend!</title>
			</Head>
			<ChakraProvider>
				<LetterContextProvider>
					<CSSReset />
					<main>
						<Component {...pageProps} />
					</main>
				</LetterContextProvider>
			</ChakraProvider>
		</>
	);
}

export default CustomApp;
