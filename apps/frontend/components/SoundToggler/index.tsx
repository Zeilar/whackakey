import { IconButton, Portal } from "@chakra-ui/react";
import { VolumeOff, VolumeUp } from "@styled-icons/evaicons-solid";
import useSoundContext from "apps/frontend/hooks/useSoundContext";

export default function SoundToggler() {
	const { isMuted, toggle } = useSoundContext();
	return (
		<Portal>
			<IconButton
				pos="fixed"
				top={10}
				left={10}
				variant="unstyled"
				onClick={toggle}
				aria-label="toggle sound"
				icon={isMuted ? <VolumeOff /> : <VolumeUp />}
			/>
		</Portal>
	);
}
