import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GithubOauthStrategy } from "../../common/strategies/GitHubOAuthStrategy";
import { UserService } from "../user/user.service";
import { AuthController } from "./auth.controller";
import { SessionSerializer } from "./auth.serializer";
import { AuthService } from "./auth.service";

@Module({
	controllers: [AuthController],
	providers: [AuthService, SessionSerializer, GithubOauthStrategy, UserService, ConfigService],
})
export class AuthModule {}
