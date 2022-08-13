import { IconButton, Portal } from "@chakra-ui/react";
import { VolumeOff, VolumeUp } from "@styled-icons/evaicons-solid";
import { useSoundContext } from "apps/frontend/hooks/";

export default function SoundToggler() {
	const { isMuted, toggle } = useSoundContext();
	return (
		<Portal>
			<IconButton
				border={0}
				w={4}
				color="gray.100"
				pos="fixed"
				top={10}
				left={10}
				rounded="full"
				stroke="blue.900"
				variant="unstyled"
				onClick={toggle}
				aria-label="toggle sound"
				icon={isMuted ? <VolumeOff /> : <VolumeUp />}
			/>
		</Portal>
	);
}
