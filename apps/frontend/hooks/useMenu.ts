import { useRouter } from "next/router";
import { useCallback } from "react";
import { Menu } from "../components/Menu";

export function useMenu() {
	const { push } = useRouter();
	const navigate = useCallback(
		(menu: Menu, args?: Record<string, string>) => {
			return () => {
				push({ query: { menu, ...args } });
			};
		},
		[push]
	);
	return navigate;
}
