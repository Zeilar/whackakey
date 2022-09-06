import {
	AbsoluteCenter,
	Button,
	Flex,
	Heading,
	Icon,
	IconButton,
	Portal,
	Spinner,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { difficulties, Difficulty, PER_PAGE } from "@shared";
import { Close, ChevronLeft, ChevronRight } from "@styled-icons/evaicons-solid";
import { useMenu } from "apps/frontend/hooks";
import { scrollbar } from "apps/frontend/layout/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
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

interface DifficultyButtonProps {
	isActive: boolean;
	onClick(): void;
	children: React.ReactNode;
}

const difficultyKeys = Object.keys(difficulties) as Difficulty[];

function DifficultyButton({ children, isActive, onClick }: DifficultyButtonProps) {
	return (
		<Button
			onClick={onClick}
			transitionDuration="0.15s"
			textTransform="uppercase"
			variant="unstyled"
			paddingInline={4}
			rounded="md"
			borderWidth={3}
			bgColor={isActive ? "blue.700" : "gray.100"}
			borderColor={isActive ? "blue.900" : "gray.300"}
			color={isActive ? "gray.100" : "blue.900"}
			_hover={!isActive ? { bgColor: "gray.200" } : undefined}
			_active={!isActive ? { bgColor: "gray.300" } : undefined}
			_focus={{}}
		>
			{children}
		</Button>
	);
}

export default function Leaderboard() {
	const [page, setPage] = useState(1);
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const fetcher = useCallback(async (): Promise<LeaderboardResponse> => {
		const response = await fetch(`${process.env.NX_API_ENDPOINT}/leaderboard/${page}/${difficulty}`);
		return response.json();
	}, [page, difficulty]);
	const { isValidating, data } = useSWRImmutable(`leaderboard-${page}-${difficulty}`, fetcher);
	const hasNextPage = useMemo(() => {
		if (data?.total == null) {
			return false;
		}
		return page * PER_PAGE <= data?.total;
	}, [data?.total, page]);
	const navigate = useMenu();

	useEffect(() => {
		setPage(1);
	}, [difficulty]);

	return (
		<Portal>
			<AbsoluteCenter
				display="flex"
				flexDir="column"
				w={800}
				h={750}
				overflowY="auto"
				rounded="xl"
				borderWidth={4}
				borderColor="blue.900"
				justifyContent="space-between"
			>
				<Flex
					pt={4}
					pb={2}
					bgColor="gray.100"
					borderBottom="inherit"
					justifyContent="center"
					alignItems="center"
					flexDir="column"
					gap={2}
				>
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
					<Flex py={2} justifyContent="center" gap={1}>
						{difficultyKeys.map(element => (
							<DifficultyButton
								key={element}
								onClick={() => setDifficulty(element)}
								isActive={element === difficulty}
							>
								{element}
							</DifficultyButton>
						))}
					</Flex>
				</Flex>
				<Table borderBottom="inherit">
					<Thead pos="sticky" top={0}>
						<Tr bgColor="blue.700">
							<Th fontWeight={400} fontSize="sm" color="gray.100" border={0} w={150} maxW={150}>
								#
							</Th>
							<Th fontWeight={400} fontSize="sm" color="gray.100" border={0} w="40%" maxW="40%">
								Name
							</Th>
							<Th fontWeight={400} fontSize="sm" color="gray.100" border={0}>
								Score
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
										<Td w={150} border={0} maxW={150}>
											{i + 1 + (page - 1) * PER_PAGE}
										</Td>
										<Td border={0} w="40%" maxW="40%">
											{record.name} {record.difficulty}
										</Td>
										<Td border={0}>{record.score}</Td>
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
				<Flex
					px={4}
					py={2}
					bgColor="gray.100"
					borderTop="inherit"
					mt="auto"
					justifyContent="space-between"
					userSelect="none"
				>
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
