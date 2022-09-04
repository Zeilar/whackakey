import { Flex, Heading, Link } from "@chakra-ui/react";
import { useSoloGameContext, useWebsocketContext } from "apps/frontend/hooks/";
import NextLink from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import DifficultyItem from "./DifficultyItem";
import SolidButton from "../SolidButton";
import RoomBrowser from "../RoomBrowser";
import { useRouter } from "next/router";
import MenuWrapper from "./MenuWrapper";
import Countdown from "../Countdown";

export type Menu = "solo" | "multiplayer" | "tutorial" | "rooms";

function BackButton() {
	const { push } = useRouter();
	return <SolidButton onClick={() => push("/")}>Back</SolidButton>;
}

export default function Menu() {
	const { query, push } = useRouter();
	const menu = query?.menu as Menu | undefined;
	const { socket } = useWebsocketContext();
	const { play, setDifficulty } = useSoloGameContext();
	const [isCountingDown, setIsCountingDown] = useState(false);
	const [countdown, setCountdown] = useState(3);
	const heading = useMemo(() => {
		switch (menu) {
			case "multiplayer":
				return "Multiplayer";
			case "solo":
				return "Solo";
			case "tutorial":
				return "Tutorial";
			case "rooms":
				return "Rooms";
			case undefined:
				return "Main menu";
		}
	}, [menu]);

	const navigate = useCallback(
		(menu: Menu) => {
			return () => {
				push({ query: { menu } });
			};
		},
		[push]
	);

	useEffect(() => {
		if (!isCountingDown) {
			return;
		}
		if (countdown <= 0) {
			play();
			return;
		}
		const timeout = window.setTimeout(() => {
			setCountdown(p => p - 1);
		}, 1000);
		return () => {
			clearTimeout(timeout);
		};
	}, [countdown, play, isCountingDown]);

	if (isCountingDown) {
		return countdown > 0 ? <Countdown countdown={countdown} /> : null;
	}

	function TutorialLink({ href, children }: { href: string; children: React.ReactNode }) {
		return (
			<NextLink passHref href={href}>
				<Link _hover={{}} tabIndex={-1}>
					<SolidButton role="link">{children}</SolidButton>
				</Link>
			</NextLink>
		);
	}

	return (
		<Flex as="nav" gap={4} flexDir="column" w={550} key="test">
			<Heading size="4xl" textStyle="stroke" textAlign="center" mb={4}>
				{heading}
			</Heading>
			{menu === undefined && (
				<MenuWrapper>
					<SolidButton onClick={navigate("solo")}>Solo</SolidButton>
					<SolidButton onClick={navigate("multiplayer")}>Multiplayer</SolidButton>
					<SolidButton onClick={navigate("tutorial")}>How to play</SolidButton>
				</MenuWrapper>
			)}
			{menu === "solo" && (
				<MenuWrapper>
					<SolidButton onClick={() => setIsCountingDown(true)} autoFocus>
						Play
					</SolidButton>
					<DifficultyItem onChange={setDifficulty} />
					<NextLink passHref href="/tutorial/solo">
						<Link _hover={{}} tabIndex={-1}>
							<SolidButton role="link">How to play</SolidButton>
						</Link>
					</NextLink>
					<BackButton />
				</MenuWrapper>
			)}
			{menu === "multiplayer" && (
				<MenuWrapper>
					<SolidButton onClick={navigate("rooms")}>Browse rooms</SolidButton>
					<SolidButton onClick={() => socket?.emit("room-create")}>Create room</SolidButton>
					<NextLink passHref href="/tutorial/multiplayer">
						<Link _hover={{}} tabIndex={-1}>
							<SolidButton role="link">How to play</SolidButton>
						</Link>
					</NextLink>
					<BackButton />
				</MenuWrapper>
			)}
			{menu === "tutorial" && (
				<MenuWrapper>
					<TutorialLink href="/tutorial/solo">Solo</TutorialLink>
					<TutorialLink href="/tutorial/multiplayer">Multiplayer</TutorialLink>
					<BackButton />
				</MenuWrapper>
			)}
			{menu === "rooms" && <RoomBrowser />}
		</Flex>
	);
}
