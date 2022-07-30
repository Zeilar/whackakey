const github = {
	clientId: process.env.OAUTH_GITHUB_CLIENT_ID,
	secret: process.env.OAUTH_GITHUB_SECRET,
	callbackUrl: process.env.OAUTH_GITHUB_CALLBACK_URL,
	scope: ["public_profile"],
};

export default github;
