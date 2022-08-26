import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function MenuWrapper({ children }: { children: React.ReactNode }) {
	return (
		<Flex
			key="test"
			flexDir="column"
			as={motion.div}
			gap={2}
			initial={{ opacity: 0.35, transform: "translateX(25px)" }}
			animate={{ opacity: 1, transform: "translateX(0px)" }}
		>
			{children}
		</Flex>
	);
}
