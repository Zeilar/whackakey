import { Button, ButtonProps } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function SolidButton(props: ButtonProps) {
	return (
		<Button
			size="xl"
			as={motion.button}
			whileHover={{ scale: 1.05 }}
			initial={{ animationDuration: "0.5s" }}
			transition="0.05s linear"
			w="full"
			{...props}
		/>
	);
}
