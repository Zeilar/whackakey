import { Button, IconButton, Text } from "@chakra-ui/react";
import { ArrowLeft } from "@styled-icons/evaicons-solid/ArrowLeft";
import { ArrowRight } from "@styled-icons/evaicons-solid/ArrowRight";
import { useSoundContext } from "apps/frontend/hooks/";
import { Mode } from "apps/frontend/types/game";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface ModeItemProps {
	onChange(mode: Mode): void;
}

const modes: Mode[] = ["solo", "multiplayer"];

export default function ModeItem({ onChange }: ModeItemProps) {
	const { playAudio } = useSoundContext();
	const [selected, setSelected] = useState(0);
	const ref = useRef<HTMLButtonElement & HTMLDivElement>(null);
	const previousButton = useRef<HTMLButtonElement>(null);
	const nextButton = useRef<HTMLButtonElement>(null);

	const previous = useCallback(() => {
		previousButton.current?.focus();
		setSelected(p => (selected - 1 in modes ? p - 1 : modes.length - 1));
		playAudio("click-2");
	}, [selected, playAudio]);

	const next = useCallback(() => {
		nextButton.current?.focus();
		setSelected(p => (selected + 1 in modes ? p + 1 : 0));
		playAudio("click-2");
	}, [selected, playAudio]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (!ref.current?.contains(document.activeElement)) {
				return;
			}
			if (e.key === "ArrowLeft") {
				previous();
			}
			if (e.key === "ArrowRight") {
				next();
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [next, previous]);

	useEffect(() => {
		onChange(modes[selected]);
	}, [selected, onChange]);

	return (
		<Button ref={ref} size="xl" as={motion.div} tabIndex={0} justifyContent="space-between" px={8}>
			<IconButton
				ref={previousButton}
				w={4}
				variant="unstyled"
				rounded="full"
				aria-label="previous difficulty"
				icon={<ArrowLeft />}
				size="lg"
				bgColor="blue.700"
				color="gray.100"
				onClick={previous}
			/>
			<Text mx={10}>{modes[selected]}</Text>
			<IconButton
				ref={nextButton}
				w={4}
				variant="unstyled"
				rounded="full"
				aria-label="next difficulty"
				icon={<ArrowRight />}
				size="lg"
				bgColor="blue.700"
				color="gray.100"
				onClick={next}
			/>
		</Button>
	);
}
