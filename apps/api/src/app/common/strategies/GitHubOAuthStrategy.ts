import { Injectable, BadRequestException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";
import config from "../../config";
import { UserService } from "../../features/user/user.service";

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, "github") {
	public constructor(private readonly userService: UserService) {
		super({
			clientID: config.oauth.github.clientId,
			clientSecret: config.oauth.github.secret,
			callbackURL: config.oauth.github.callbackUrl,
			scope: config.oauth.github.scope,
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
