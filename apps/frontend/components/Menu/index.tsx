import { Flex, Heading, Link } from "@chakra-ui/react";
import { useSoloGameContext, useWebsocketContext } from "apps/frontend/hooks/";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import DifficultyItem from "./DifficultyItem";
import SolidButton from "../SolidButton";
import RoomBrowser from "../RoomBrowser";
import { useRouter } from "next/router";

export type Menu = "solo" | "multiplayer" | "tutorial" | "rooms";

export default function Menu() {
	const { query } = useRouter();
	const menu = query?.menu as Menu | undefined;
	const { socket } = useWebsocketContext();
	const { play, setDifficultyTiming } = useSoloGameContext();
	const [isCountingDown, setIsCountingDown] = useState(false);
	const [countdown, setCountdown] = useState(3);
	const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
	const heading = useMemo(() => {
		switch (activeMenu) {
			case "multiplayer":
				return "Multiplayer";
			case "solo":
				return "Solo";
			case "tutorial":
				return "Tutorial";
			case "rooms":
				return "Rooms";
			case null:
				return "Main menu";
		}
	}, [activeMenu]);

	useEffect(() => {
		setActiveMenu(menu ?? null);
	}, [menu]);

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

	function countdownColor() {
		if (countdown === 3) {
			return "red.500";
		}
		if (countdown === 2) {
			return "yellow.500";
		}
		if (countdown === 1) {
			return "green.500";
		}
	}

	if (isCountingDown) {
		return countdown > 0 ? (
			<Heading userSelect="none" fontSize="10rem" textStyle="stroke" color={countdownColor()}>
				{countdown}
			</Heading>
		) : null;
	}

	function BackButton() {
		return <SolidButton onClick={() => setActiveMenu(null)}>Back</SolidButton>;
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
		<Flex as="nav" gap={4} flexDir="column" width={550}>
			<Heading size="4xl" textStyle="stroke" textAlign="center" mb={4}>
				{heading}
			</Heading>
			{activeMenu === null && (
				<>
					<SolidButton onClick={() => setActiveMenu("solo")}>Solo</SolidButton>
					<SolidButton onClick={() => setActiveMenu("multiplayer")}>Multiplayer</SolidButton>
					<SolidButton onClick={() => setActiveMenu("tutorial")}>How to play</SolidButton>
				</>
			)}
			{activeMenu === "solo" && (
				<>
					<SolidButton onClick={() => setIsCountingDown(true)} autoFocus>
						Play
					</SolidButton>
					<DifficultyItem onChange={setDifficultyTiming} />
					<NextLink passHref href="/tutorial/solo">
						<Link _hover={{}} tabIndex={-1}>
							<SolidButton role="link">How to play</SolidButton>
						</Link>
					</NextLink>
					<BackButton />
				</>
			)}
			{activeMenu === "multiplayer" && (
				<>
					<SolidButton onClick={() => setActiveMenu("rooms")}>Browse rooms</SolidButton>
					<SolidButton onClick={() => socket?.emit("room-create")}>Create room</SolidButton>
					<NextLink passHref href="/tutorial/multiplayer">
						<Link _hover={{}} tabIndex={-1}>
							<SolidButton role="link">How to play</SolidButton>
						</Link>
					</NextLink>
					<BackButton />
				</>
			)}
			{activeMenu === "tutorial" && (
				<>
					<TutorialLink href="/tutorial/solo">Solo</TutorialLink>
					<TutorialLink href="/tutorial/multiplayer">Multiplayer</TutorialLink>
					<BackButton />
				</>
			)}
			{activeMenu === "rooms" && <RoomBrowser onBack={() => setActiveMenu("multiplayer")} />}
		</Flex>
	);
}
