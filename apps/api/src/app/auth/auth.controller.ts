import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { GithubOAuthGuard } from "../common/guards/GitHubOAuth.guard";
import { Response } from "express";

@Controller("/auth")
export class AuthController {
	public constructor() {
		//
	}

	@Get("/whoami")
	public whoami(@Req() req: Express.Request, @Res() res: Response) {
		req.isAuthenticated() ? res.send({ userId: req.user }) : res.sendStatus(401);
	}

	@Get("/github")
	@UseGuards(new GithubOAuthGuard())
	public github() {
		// Handled in GitHubOAuthGuard guard
	}

	@Get("/github/callback")
	@UseGuards(new GithubOAuthGuard())
	public githubCallback(@Res() res: Response) {
		res.redirect("/");
	}
}
