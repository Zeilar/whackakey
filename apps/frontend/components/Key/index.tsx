import { Flex, Text } from "@chakra-ui/react";
import { playAudio } from "apps/frontend/common/helpers";
import useLetterContext from "apps/frontend/hooks/useLetterContext";
import useScoreContext from "apps/frontend/hooks/useScoreContext";
import { useEffect, useMemo, useState } from "react";

interface Props {
	symbol: string;
}

export default function Key({ symbol }: Props) {
	const { letter, isLocked, setIsLocked } = useLetterContext();
	const { hit, miss } = useScoreContext();
	const [isPressed, setIsPressed] = useState(false);
	const isActive = useMemo(() => letter === symbol, [letter, symbol]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key !== symbol || isPressed) {
				return;
			}
			setIsPressed(true);
			if (isLocked) {
				playAudio("click");
				return;
			}
			setIsLocked(true);
			if (e.key === letter) {
				hit();
			} else {
				miss();
			}
		}
		function onKeyUp(e: KeyboardEvent) {
			if (e.key !== symbol) {
				return;
			}
			setIsPressed(false);
		}
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("keyup", onKeyUp);
		};
	}, [symbol, letter, setIsLocked, isLocked, hit, miss, isPressed]);

	return (
		<Flex
			justifyContent="center"
			alignItems="center"
			w={100}
			h={100}
			bgColor={isPressed ? "whiteAlpha.800" : "whiteAlpha.900"}
			borderWidth={4}
			borderColor="blackAlpha.300"
			rounded="xl"
			boxShadow="var(--chakra-shadows-lg), 0 0 5px 0 inset rgba(0, 0, 0, 0.1)"
		>
			<Text textTransform="uppercase" fontWeight="bold" fontSize="4xl" userSelect="none" color="blue.700">
				{symbol}
			</Text>
		</Flex>
	);
}
