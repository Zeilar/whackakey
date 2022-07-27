import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GithubOauthStrategy } from "../common/strategies/GitHubOAuthStrategy";
import { UserService } from "../user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	controllers: [AuthController],
	providers: [AuthService, GithubOauthStrategy, UserService, ConfigService],
})
export class AuthModule {}
