import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { Difficulty } from "@shared";
import { ArrowLeft } from "@styled-icons/evaicons-solid/ArrowLeft";
import { ArrowRight } from "@styled-icons/evaicons-solid/ArrowRight";
import useGameContext from "apps/frontend/hooks/useGameContext";
import { DifficultyTiming } from "apps/frontend/types/game";
import { useEffect, useState } from "react";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];
const difficultiesMap: Record<Difficulty, DifficultyTiming> = {
	easy: DifficultyTiming.EASY,
	medium: DifficultyTiming.MEDIUM,
	hard: DifficultyTiming.HARD,
};

interface DifficultyItemProps {
	onChange(difficultyTiming: DifficultyTiming): void;
}

function DifficultyItem({ onChange }: DifficultyItemProps) {
	const [selected, setSelected] = useState(0);

	useEffect(() => {
		onChange(difficultiesMap[difficulties[selected]]);
	}, [selected, onChange]);

	function previous() {
		if (selected - 1 in difficulties) {
			setSelected(p => p - 1);
		} else {
			setSelected(difficulties.length - 1);
		}
	}

	function next() {
		if (selected + 1 in difficulties) {
			setSelected(p => p + 1);
		} else {
			setSelected(0);
		}
	}

	return (
		<Button as="div" variant="key" size="xl" justifyContent="space-between" px={8}>
			<IconButton variant="unstyled" aria-label="previous difficulty" icon={<ArrowLeft />} onClick={previous} />
			<Text mx={10}>{difficulties[selected]}</Text>
			<IconButton variant="unstyled" aria-label="next difficulty" icon={<ArrowRight />} onClick={next} />
		</Button>
	);
}

export default function Menu() {
	const { setIsPlaying, setDifficultyTiming, difficultyTiming } = useGameContext();

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
