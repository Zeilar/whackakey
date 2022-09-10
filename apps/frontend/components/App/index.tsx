import { Flex, Heading, Progress, useMediaQuery } from "@chakra-ui/react";
import { useSoundContext } from "apps/frontend/hooks";
import { useMemo } from "react";
import Header from "../Header";
import Latency from "../Latency";
import SoundToggler from "../SoundToggler";

interface Props {
	children: React.ReactNode;
}

export default function App({ children }: Props) {
	const [isTouch, isSmall] = useMediaQuery(["(hover: none)", "(max-width: 1280px)"]);
	const isSupported = useMemo(() => !isTouch && !isSmall, [isTouch, isSmall]);
	const { hasLoadedSounds, progress } = useSoundContext();

	function Children() {
		if (!isSupported) {
			return (
				<Heading size="2xl" textStyle="stroke" textAlign="center">
					Your device is not supported
				</Heading>
			);
		}
		return (
			<>
				<SoundToggler />
				<Latency />
				<Header />
				{children}
			</>
		);
	}

	return (
		<Flex
			h="100%"
			justifyContent="center"
			alignItems="center"
			bgImg="radial-gradient(circle, transparent 25%, var(--chakra-colors-blue-700) 26%),linear-gradient(0deg, transparent 44%, var(--chakra-colors-blue-900) 45%, var(--chakra-colors-blue-900) 55%, transparent 56%), linear-gradient(90deg, transparent 44%, var(--chakra-colors-blue-900) 45%, var(--chakra-colors-blue-900) 55%, transparent 56%)"
			bgColor="blue.700"
			bgSize="1.5em 1.5em"
		>
			{!hasLoadedSounds ? (
				<Progress size="lg" width={750} rounded="sm" isAnimated hasStripe value={progress} />
			) : (
				<Children />
			)}
		</Flex>
	);
}
