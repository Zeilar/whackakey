export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			WS_ENDPOINT: string;
		}
	}
}

declare namespace NodeJS {
	interface ProcessEnv {
		WS_ENDPOINT: string;
	}
}
