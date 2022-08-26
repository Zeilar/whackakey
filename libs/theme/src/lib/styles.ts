export const styles = {
	global: {
		body: {
			color: "blue.900",
			h: "100vh",
		},
		"#__next": {
			h: "100%",
			display: "flex",
			flexDir: "column",
		},
		"::selection": {
			bgColor: "blue.300",
			color: "blue.900",
		},
		".Toastify__toast": {
			bgColor: "blue.900",
			userSelect: "none",
		},
		".Toastify__toast-body": {
			color: "gray.100",
			fontFamily: "Inter, sans-serif",
		},
		".Toastify__close-button": {
			color: "gray.100",
			opacity: 1,
		},
	},
};
