import { Box, Flex, Heading, IconButton, keyframes } from "@chakra-ui/react";
import { useWebsocketContext } from "apps/frontend/hooks";
import { Result } from "apps/frontend/types/multiplayer";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline";
import { motion } from "framer-motion";

interface Props extends Result {
	onClose(): void;
}

const BANNER_BG_SIZE = 40;

const bannerAnimation = keyframes`
    0% {
        background-position: -${BANNER_BG_SIZE}px ${BANNER_BG_SIZE}px;
    }
    to {
        background-position: ${BANNER_BG_SIZE}px -${BANNER_BG_SIZE}px;
    }
`;

export default function LobbyResult({ type, winner, onClose }: Props) {
	const { name } = useWebsocketContext();
	return (
		<motion.div exit={{ height: 0 }}>
			<Flex bgColor="blue.700" borderBottomWidth={4} borderBottomColor="blue.900">
				<Flex flexDir="column" grow={1}>
					<Box
						h={6}
						animation={`${bannerAnimation} 2.5s linear infinite`}
						bgColor={type === "winner" ? "green.500" : "yellow.400"}
						bgImg={`url(/assets/images/${type === "winner" ? "confetti" : "tie"}.svg)`}
						bgSize={BANNER_BG_SIZE}
					/>
					<Heading size="lg" color="gray.100" textStyle="stroke" p={4}>
						{type === "winner" ? (
							<>
								<Box as="span" color={name === winner ? "yellow.500" : undefined}>
									{`${winner} `}
								</Box>
								won the round
							</>
						) : (
							"The round ended in a tie"
						)}
					</Heading>
				</Flex>
				<IconButton
					aria-label="Close lobby result"
					variant="unstyled"
					minW="auto"
					w={10}
					borderRight={0}
					borderBottom={0}
					borderTop={0}
					borderLeftWidth={4}
					borderLeftColor="blue.900"
					bgColor="red.500"
					color="red.900"
					rounded="none"
					pos="unset"
					h="auto"
					icon={<CloseSquareOutline />}
					onClick={onClose}
					_focus={{}}
				/>
			</Flex>
		</motion.div>
	);
}
