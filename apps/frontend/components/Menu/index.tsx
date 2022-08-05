import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { Difficulty } from "@shared";
import { ArrowLeft } from "@styled-icons/evaicons-solid/ArrowLeft";
import { ArrowRight } from "@styled-icons/evaicons-solid/ArrowRight";
import useGameContext from "apps/frontend/hooks/useGameContext";
import { DifficultyTiming } from "apps/frontend/types/game";
import { useCallback, useEffect, useRef, useState } from "react";

interface DifficultyItemProps {
	onChange(difficultyTiming: DifficultyTiming): void;
}

const difficulties: Difficulty[] = ["easy", "medium", "hard"];
const difficultiesMap: Record<Difficulty, DifficultyTiming> = {
	easy: DifficultyTiming.EASY,
	medium: DifficultyTiming.MEDIUM,
	hard: DifficultyTiming.HARD,
};

const difficultyColors = ["green.500", "yellow.500", "red.500"];

function DifficultyItem({ onChange }: DifficultyItemProps) {
	const [selected, setSelected] = useState(0);
	const ref = useRef<HTMLDivElement>(null);

	const previous = useCallback(() => {
		setSelected(p => (selected - 1 in difficulties ? p - 1 : difficulties.length - 1));
	}, [selected]);

	const next = useCallback(() => {
		setSelected(p => (selected + 1 in difficulties ? p + 1 : 0));
	}, [selected]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (!ref.current?.contains(document.activeElement) || !["ArrowLeft", "ArrowRight"].includes(e.key)) {
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
		onChange(difficultiesMap[difficulties[selected]]);
	}, [selected, onChange]);

	return (
		<Button
			// @ts-expect-error type bug
			ref={ref}
			as="div"
			variant="key"
			size="xl"
			tabIndex={0}
			justifyContent="space-between"
			px={8}
			_hover={{}}
		>
			<IconButton
				variant="unstyled"
				aria-label="previous difficulty"
				icon={<ArrowLeft />}
				size="lg"
				bgColor="blue.700"
				color="gray.100"
				onClick={previous}
			/>
			<Text color={difficultyColors[selected]} mx={10}>
				{difficulties[selected]}
			</Text>
			<IconButton
				variant="unstyled"
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

export default function Menu() {
	const { setIsPlaying, setDifficultyTiming } = useGameContext();

	function play() {
		setIsPlaying(true);
	}

	return (
		<Flex as="nav" gap={4} flexDir="column" width={500}>
			<Button variant="key" size="xl" onClick={play}>
				Play
			</Button>
			<DifficultyItem onChange={setDifficultyTiming} />
			<Button variant="key" size="xl">
				How to play
			</Button>
		</Flex>
	);
}
