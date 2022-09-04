import { Box, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface Props {
	countdown: number;
}

export default function Countdown({ countdown }: Props) {
	const color = useMemo(() => {
		switch (countdown) {
			case 3:
				return "red.500";
			case 2:
				return "yellow.500";
			case 1:
				return "green.500";
			default:
				return "red.500";
		}
	}, [countdown]);

	return (
		<Box
			key={countdown}
			as={motion.div}
			transition="0.1s"
			initial={{ transform: "scale(5)", opacity: 0.5 }}
			animate={{ transform: "scale(2.5)", opacity: 1 }}
		>
			<Heading textStyle="stroke" size="4xl" color={color} userSelect="none">
				{countdown}
			</Heading>
		</Box>
	);
}
