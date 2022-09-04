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
				<Flex flexDir="column" borderBottom="inherit">
					<Table>
						<Thead pos="sticky" top={0}>
							<Tr bgColor="blue.700">
								<Th fontWeight={400} fontSize="sm" color="gray.100" border={0} w={75} maxW={75}>
									#
								</Th>
								<Th fontWeight={400} fontSize="sm" color="gray.100" border={0}>
									Name
								</Th>
								<Th fontWeight={400} fontSize="sm" color="gray.100" border={0} w={200} maxW={200}>
									Score
								</Th>
							</Tr>
						</Thead>
					</Table>
				</Flex>
				<Flex
					flexDir="column"
					sx={scrollbar}
					bgColor="transparent"
					transition="0.25s"
					_hover={{ bgColor: "blue.900" }}
				>
					<Table>
						<Tbody>
							{leaderboard.map((highscore, i) => (
								<Tr key={i} bgColor="gray.300" _odd={{ bgColor: "gray.200" }}>
									<Td w={75} border={0} maxW={75}>
										{i + 1}
									</Td>
									<Td border={0}>{highscore.name}</Td>
									<Td border={0} w={200} maxW={200}>
										{highscore.score}
									</Td>
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
