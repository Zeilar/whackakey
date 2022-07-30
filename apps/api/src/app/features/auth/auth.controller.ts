import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { GithubOAuthGuard } from "../../common/guards/GitHubOAuth.guard";
import { Request, Response } from "express";

@Controller("/auth")
export class AuthController {
	public constructor() {
		//
	}

	@Get("/whoami")
	public whoami(@Req() req: Request, @Res() res: Response) {
		req.isAuthenticated() ? res.send({ userId: req.user }) : res.sendStatus(401);
	}

	@Get("/logout")
	public logout(@Req() req: Request, @Res() res: Response) {
		if (req.isAuthenticated()) {
			res.sendStatus(400);
			return;
		}
		req.logOut(() => {
			res.redirect("/");
		});
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
