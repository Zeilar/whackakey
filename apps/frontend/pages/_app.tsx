import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { LetterContextProvider } from "../contexts/LetterContext";
import { ScoreContextProvider } from "../contexts/ScoreContext";
import { SoundContextProvider } from "../contexts/SoundContext";

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Whack a key</title>
			</Head>
			<ChakraProvider>
				<SoundContextProvider>
					<LetterContextProvider>
						<ScoreContextProvider>
							<CSSReset />
							<main>
								<Component {...pageProps} />
							</main>
						</ScoreContextProvider>
					</LetterContextProvider>
				</SoundContextProvider>
			</ChakraProvider>
		</>
	);
}

export default CustomApp;
