import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { GithubOAuthGuard } from "../common/guards/GitHubOAuth.guard";
import { AuthService } from "./auth.service";

@Controller("/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("/whoami")
	public whoami(@Req() req: Express.Request) {
		console.log(req.user);
		return req.user;
	}

	@Get("/github")
	@UseGuards(GithubOAuthGuard)
	public async github() {
		// Handled in GitHubOAuthGuard guard
	}

	@Get("/github/callback")
	@UseGuards(GithubOAuthGuard)
	public async githubCallback(@Req() req: Express.Request) {
		console.log(req.authInfo, req.isAuthenticated());
		console.log("USER", req.user);
	}
}
