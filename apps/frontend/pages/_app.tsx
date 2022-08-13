import "../common/fonts";
import "../common/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, CSSReset, Flex } from "@chakra-ui/react";
import { SoundContextProvider } from "../contexts/SoundContext";
import theme from "@theme";
import { SoloGameContextProvider } from "../contexts/SoloGameContext";
import Header from "../components/Header";
import { WebsocketContextProvider } from "../contexts/WebsocketContext";
import Test from "../components/Latency/Test";
import SoundToggler from "../components/SoundToggler";
import Latency from "../components/Latency";
import { ToastContainer } from "react-toastify";

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
							<Flex
								h="100%"
								justifyContent="center"
								alignItems="center"
								bgImg="radial-gradient(circle, transparent 25%, var(--chakra-colors-blue-700) 26%),linear-gradient(0deg, transparent 44%, var(--chakra-colors-blue-900) 45%, var(--chakra-colors-blue-900) 55%, transparent 56%), linear-gradient(90deg, transparent 44%, var(--chakra-colors-blue-900) 45%, var(--chakra-colors-blue-900) 55%, transparent 56%)"
								bgColor="blue.700"
								bgSize="1.5em 1.5em"
							>
								<SoundToggler />
								<Latency />
								<Test />
								<Header />
								<Component {...pageProps} />
							</Flex>
						</ChakraProvider>
					</SoloGameContextProvider>
				</WebsocketContextProvider>
			</SoundContextProvider>
		</>
	);
}

export default CustomApp;
