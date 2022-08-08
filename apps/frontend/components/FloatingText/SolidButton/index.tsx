import { As, Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { motion } from "framer-motion";
// import { forwardRef } from "react";

export default forwardRef<ButtonProps, As<ButtonProps>>(function SolidButton(props, ref) {
	return (
		<Button
			ref={ref}
			size="xl"
			as={motion.button}
			whileHover={{ scale: 1.05 }}
			initial={{ animationDuration: "0.5s" }}
			transition="0.05s linear"
			w="full"
			{...props}
		/>
	);
});
