import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GithubOAuthGuard extends AuthGuard("github") {
	public async canActivate(context: ExecutionContext) {
		if (await super.canActivate(context)) {
			const request = context.switchToHttp().getRequest();
			await super.logIn(request);
		}
		return true;
	}
}
