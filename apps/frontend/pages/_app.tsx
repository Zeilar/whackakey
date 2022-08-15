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
				<title>Whack a key</title>
			</Head>
			<CSSReset />
			<ToastContainer position="top-right" draggable={false} pauseOnHover={false} pauseOnFocusLoss={false} />
			<SoundContextProvider>
				<WebsocketContextProvider>
					<SoloGameContextProvider>
						<ChakraProvider theme={theme}>
							<App>
								<Component {...pageProps} />
							</App>
						</ChakraProvider>
					</SoloGameContextProvider>
				</WebsocketContextProvider>
			</SoundContextProvider>
		</>
	);
}

export default CustomApp;
