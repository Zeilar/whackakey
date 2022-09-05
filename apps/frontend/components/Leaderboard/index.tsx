import {
	AbsoluteCenter,
	Button,
	Flex,
	Heading,
	Icon,
	IconButton,
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
import { difficulties, Difficulty, PER_PAGE } from "@shared";
import { ChevronDown, Close, ChevronLeft, ChevronRight } from "@styled-icons/evaicons-solid";
import { useMenu } from "apps/frontend/hooks";
import { scrollbar } from "apps/frontend/layout/styles";
import { useCallback, useMemo, useState } from "react";
import useSWRImmutable from "swr/immutable";

interface Highscore {
	score: number;
	name: string;
	difficulty: Difficulty;
}

interface LeaderboardResponse {
	leaderboard: Highscore[];
	total: number;
}

const difficultyKeys = Object.keys(difficulties) as Difficulty[];

export default function Leaderboard() {
	const [page, setPage] = useState(1);
	const fetcher = useCallback(async (): Promise<LeaderboardResponse> => {
		const response = await fetch(`${process.env.NX_API_ENDPOINT}/leaderboard/${page}`);
		return response.json();
	}, [page]);
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const { isValidating, data } = useSWRImmutable(`leaderboard-${page}`, fetcher);
	const difficultyDisclosure = useDisclosure();
	const hasNextPage = useMemo(() => {
		if (data?.total == null) {
			return false;
		}
		const ellapsed = page * PER_PAGE;
		return ellapsed <= data?.total;
	}, [data?.total, page]);
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
				w={800}
				h={750}
				bgColor="gray.300"
				overflowY="auto"
				rounded="xl"
				borderWidth={4}
				borderColor="blue.900"
				justifyContent="space-between"
			>
				<Flex py={4} bgColor="gray.100" borderBottom="inherit" pos="relative" justifyContent="center">
					<Heading>Leaderboard</Heading>
					<IconButton
						variant="unstyled"
						borderWidth={3}
						borderColor="red.900"
						bgColor="red.500"
						color="red.900"
						pos="absolute"
						minW="auto"
						w={8}
						h={8}
						display="flex"
						aria-label="Close leaderboard"
						icon={<Close />}
						top={2}
						right={2}
						onClick={navigate("solo")}
						_hover={{ bgColor: "red.400" }}
						_focus={{}}
					/>
				</Flex>
				<Table borderBottom="inherit">
					<Thead pos="sticky" top={0}>
						<Tr bgColor="blue.700">
							<Th fontWeight={400} fontSize="sm" color="gray.100" border={0} w={125} maxW={125}>
								#
							</Th>
							<Th fontWeight={400} fontSize="sm" color="gray.100" border={0} w={250} maxW={250}>
								Name
							</Th>
							<Th fontWeight={400} fontSize="sm" color="gray.100" border={0}>
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
				<Flex bgColor="transparent" transition="0.25s" sx={scrollbar} _hover={{ bgColor: "blue.900" }}>
					<Table>
						<Tbody>
							{Array.isArray(data?.leaderboard) &&
								data?.leaderboard.map((record, i) => (
									<Tr key={i} bgColor="gray.300" _odd={{ bgColor: "gray.200" }}>
										<Td w={125} border={0} maxW={125}>
											{i + 1 + (page - 1) * PER_PAGE}
										</Td>
										<Td border={0} w={250} maxW={250}>
											{record.name}
										</Td>
										<Td border={0}>{record.score}</Td>
										<Td border={0} w={150} maxW={150}>
											{record.difficulty}
										</Td>
									</Tr>
								))}
						</Tbody>
					</Table>
				</Flex>
				{isValidating && (
					<AbsoluteCenter>
						<Spinner m="auto" size="xl" />
					</AbsoluteCenter>
				)}
				<Flex px={4} py={2} bgColor="gray.100" borderTop="inherit" mt="auto" justifyContent="space-between">
					<Button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page <= 1}>
						<Icon w={8} h={8} as={ChevronLeft} />
					</Button>
					<Button onClick={() => setPage(p => (hasNextPage ? p + 1 : p))} disabled={!hasNextPage}>
						<Icon w={8} h={8} as={ChevronRight} />
					</Button>
				</Flex>
			</AbsoluteCenter>
		</Portal>
	);
}
