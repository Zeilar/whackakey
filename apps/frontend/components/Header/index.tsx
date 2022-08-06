import { Button, ButtonProps, Flex } from "@chakra-ui/react";

function Item(props: ButtonProps) {
	return <Button as="span" variant="key" size="xl" py={6} px={8} _hover={{}} {...props} />;
}

export default function Header() {
	return (
		<Flex as="header" pos="fixed" top={10} left="50%" transform="translateX(-50%)" gap={4}>
			<Item>Whack</Item>
			<Item>A</Item>
			<Item>Key</Item>
		</Flex>
	);
}
