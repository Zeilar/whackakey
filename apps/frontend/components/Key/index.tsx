import { Box, Text } from "@chakra-ui/react";
import useLetterContext from "apps/frontend/hooks/useLetterContext";
import { useEffect, useMemo, useState } from "react";

interface Props {
	symbol: string;
}

export default function Key({ symbol }: Props) {
	const { letter, isLocked, setIsLocked } = useLetterContext();
	const [isPressed, setIsPressed] = useState(false);
	const isActive = useMemo(() => letter === symbol, [letter, symbol]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key !== symbol) {
				return;
			}
			setIsPressed(true);
			if (isLocked) {
				return;
			}
			setIsLocked(true);
			console.log(e.key === letter);
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
	}, [symbol, letter, setIsLocked, isLocked]);

	function getBgColor() {
		return isPressed ? "blackAlpha.200" : undefined;
	}

	return (
		<Box w={100} h={100} borderWidth={2} borderColor="black" ml="-2px" bgColor={getBgColor()}>
			<Text textTransform="uppercase" fontWeight="bold" fontSize="2xl" ml={2}>
				{symbol}
			</Text>
		</Box>
	);
}
