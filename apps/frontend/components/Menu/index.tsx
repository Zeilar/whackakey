import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { Difficulty } from "@shared";
import { ArrowLeft } from "@styled-icons/evaicons-solid/ArrowLeft";
import { ArrowRight } from "@styled-icons/evaicons-solid/ArrowRight";
import useGameContext from "apps/frontend/hooks/useGameContext";
import { DifficultyTiming } from "apps/frontend/types/game";
import { useEffect, useState } from "react";

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

	useEffect(() => {
		onChange(difficultiesMap[difficulties[selected]]);
	}, [selected, onChange]);

	function previous() {
		setSelected(p => (selected - 1 in difficulties ? p - 1 : difficulties.length - 1));
	}

	function next() {
		setSelected(p => (selected + 1 in difficulties ? p + 1 : 0));
	}

	return (
		<Button as="div" variant="key" size="xl" justifyContent="space-between" px={8} _hover={{}}>
			<IconButton
				variant="unstyled"
				aria-label="previous difficulty"
				icon={<ArrowLeft />}
				size="lg"
				bgColor="blue.700"
				color="gray.100"
				onClick={previous}
				_focus={{}}
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
				_focus={{}}
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
