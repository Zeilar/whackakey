import { Button, Flex } from "@chakra-ui/react";

export default function Header() {
	return (
		<Flex as="header" pos="fixed" top={10} left="50%" transform="translateX(-50%)" gap={4}>
			<Button variant="key" size="xl" py={6} px={8}>
				Whack
			</Button>
			<Button variant="key" size="xl" py={6} px={8}>
				A
			</Button>
			<Button variant="key" size="xl" py={6} px={8}>
				Key
			</Button>
		</Flex>
	);
}
