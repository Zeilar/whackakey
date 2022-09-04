import { AbsoluteCenter, Box, Button, Flex, Heading, Portal, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Difficulty } from "@shared";
import { useMenu } from "apps/frontend/hooks";
import { scrollbar } from "apps/frontend/layout/styles";
import { useEffect, useState } from "react";

interface Highscore {
	score: number;
	name: string;
	difficulty: Difficulty;
}

export default function Leaderboard() {
	const [leaderboard, setLeaderboard] = useState<Highscore[]>([]);
	const navigate = useMenu();

	useEffect(() => {
		fetch(`${process.env.NX_API_ENDPOINT}/leaderboard`)
			.then(response => response.json())
			.then(setLeaderboard);
	}, []);

	return (
		<Portal>
			<AbsoluteCenter
				display="flex"
				flexDir="column"
				w={600}
				h={750}
				bgColor="gray.300"
				overflowY="auto"
				rounded="xl"
				borderWidth={4}
				borderColor="blue.900"
				justifyContent="space-between"
			>
				<Heading py={4} textAlign="center" bgColor="gray.100" borderBottom="inherit">
					Leaderboard
				</Heading>
				<Table borderBottom="inherit">
					<Thead pos="sticky" top={0}>
						<Tr bgColor="blue.700">
							<Th color="gray.100" fontWeight={400} fontSize="sm" w="60%" border={0}>
								Name
							</Th>
							<Th color="gray.100" fontWeight={400} fontSize="sm" border={0}>
								Score
							</Th>
						</Tr>
					</Thead>
				</Table>
				<Flex
					flexDir="column"
					overflowY="auto"
					sx={scrollbar}
					bgColor="transparent"
					_hover={{ bgColor: "blue.900" }}
					transition="0.25s"
				>
					<Table>
						<Tbody>
							{leaderboard.map((highscore, i) => (
								<Tr key={i} bgColor="gray.300" _odd={{ bgColor: "gray.200" }}>
									<Td w="60%" border={0}>
										{highscore.name}
									</Td>
									<Td border={0}>{highscore.score}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Flex>
				<Box px={4} py={2} bgColor="gray.100" borderTop="inherit">
					<Button px={12} size="lg" onClick={navigate("solo")}>
						Back
					</Button>
				</Box>
			</AbsoluteCenter>
		</Portal>
	);
}
