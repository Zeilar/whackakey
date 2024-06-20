import "../common/fonts";
import "../common/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { SoundContextProvider } from "../contexts/SoundContext";
import theme from "@theme";
import { SoloGameContextProvider } from "../contexts/SoloGameContext";
import { WebsocketContextProvider } from "../contexts/WebsocketContext";
import { ToastContainer } from "react-toastify";
import App from "../components/App";

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Whack A Key</title>
			</Head>
			<CSSReset />
			<ToastContainer
				autoClose={2000}
				position="top-right"
				draggable={false}
				pauseOnHover={false}
				pauseOnFocusLoss={false}
				limit={5}
				hideProgressBar
			/>
			<ChakraProvider theme={theme}>
				<WebsocketContextProvider>
					<SoundContextProvider>
						<SoloGameContextProvider>
							<App>
								<Component {...pageProps} />
							</App>
						</SoloGameContextProvider>
					</SoundContextProvider>
				</WebsocketContextProvider>
			</ChakraProvider>
		</>
	);
}

export default CustomApp;
