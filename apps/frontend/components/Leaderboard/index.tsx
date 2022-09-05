import {
	AbsoluteCenter,
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Portal,
	Spinner,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import { difficulties, Difficulty } from "@shared";
import { ChevronDown } from "@styled-icons/evaicons-solid";
import { useMenu } from "apps/frontend/hooks";
import { scrollbar } from "apps/frontend/layout/styles";
import { useCallback, useState } from "react";
import useSWR from "swr";

interface Highscore {
	score: number;
	name: string;
	difficulty: Difficulty;
}

const difficultyKeys = Object.keys(difficulties) as Difficulty[];

export default function Leaderboard() {
	const [page, setPage] = useState(1);
	const fetcher = useCallback(async () => {
		const response = await fetch(`${process.env.NX_API_ENDPOINT}/leaderboard/${page}`);
		const data: Highscore[] = await response.json();
		return data;
	}, [page]);
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const { isValidating, data } = useSWR(`leaderboard-${page}`, fetcher);
	const difficultyDisclosure = useDisclosure();
	const navigate = useMenu();

	const changeDifficulty = useCallback(
		(difficulty: Difficulty) => {
			difficultyDisclosure.onClose();
			setDifficulty(difficulty);
		},
		[difficultyDisclosure]
	);

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
				<Flex borderBottom="inherit">
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
								<Th fontWeight={400} fontSize="sm" color="gray.100" border={0} w={150} maxW={150}>
									<Popover
										placement="bottom"
										isOpen={difficultyDisclosure.isOpen}
										onClose={difficultyDisclosure.onClose}
									>
										<PopoverTrigger>
											<Button
												variant="unstyled"
												textTransform="uppercase"
												display="flex"
												alignItems="center"
												h="auto"
												border={0}
												fontSize="sm"
												rightIcon={<Icon as={ChevronDown} w={6} h={6} />}
												onClick={difficultyDisclosure.onToggle}
												_focus={{}}
											>
												{difficulty}
											</Button>
										</PopoverTrigger>
										<Portal>
											<PopoverContent
												bgColor="blue.900"
												w={125}
												border={0}
												boxShadow="xl"
												overflow="hidden"
											>
												{difficultyKeys.map(difficulty => (
													<Button
														variant="unstyled"
														color="gray.100"
														fontSize="sm"
														border={0}
														h="auto"
														py={4}
														textTransform="uppercase"
														key={difficulty}
														rounded="none"
														onClick={() => changeDifficulty(difficulty)}
														_hover={{ bgColor: "whiteAlpha.50" }}
														_active={{ bgColor: "whiteAlpha.200" }}
														_focus={{}}
													>
														{difficulty}
													</Button>
												))}
											</PopoverContent>
										</Portal>
									</Popover>
								</Th>
							</Tr>
						</Thead>
					</Table>
				</Flex>
				<Flex bgColor="transparent" transition="0.25s" sx={scrollbar} _hover={{ bgColor: "blue.900" }}>
					<Table>
						<Tbody>
							{Array.isArray(data) &&
								data.map((record, i) => (
									<Tr key={i} bgColor="gray.300" _odd={{ bgColor: "gray.200" }}>
										<Td w={75} border={0} maxW={75}>
											{i + 1}
										</Td>
										<Td border={0}>{record.name}</Td>
										<Td border={0} w={200} maxW={200}>
											{record.score}
										</Td>
										<Td border={0} w={150} maxW={150}>
											{record.difficulty}
										</Td>
									</Tr>
								))}
						</Tbody>
					</Table>
				</Flex>
				{isValidating && <Spinner m="auto" size="xl" />}
				<Box px={4} py={2} bgColor="gray.100" borderTop="inherit" mt="auto">
					<Button px={12} size="lg" onClick={navigate("solo")}>
						Back
					</Button>
				</Box>
			</AbsoluteCenter>
		</Portal>
	);
}
