import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";
import { EnvConfig } from "../../config/env";
import { UserService } from "../../features/user/user.service";

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, "github") {
	public constructor(private readonly userService: UserService, configService: ConfigService<EnvConfig, true>) {
		super({
			clientID: configService.get("OAUTH_GITHUB_CLIENT_ID", { infer: true }),
			clientSecret: configService.get("OAUTH_GITHUB_SECRET", { infer: true }),
			callbackURL: configService.get("OAUTH_GITHUB_CALLBACK_URL", { infer: true }),
			scope: ["public_profile"],
		});
	}

	public async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		const { id, provider, emails, photos } = profile;
		let user = await this.userService.findUserByProvider(id, provider);
		if (!user) {
			if (!emails || !photos) {
				throw new BadRequestException();
			}
			user = await this.userService.createUserWithGitHubAccount({
				provider,
				providerUid: id,
				email: emails[0].value,
				image: photos[0].value,
			});
		}
		return user;
	}
}
