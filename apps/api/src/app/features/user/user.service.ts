import { Injectable } from "@nestjs/common";
import { RegisterGitHubAccountDto } from "../../../types/RegisterGitHubAccountDto";
import { Account } from "../account/account.entity";
import { User } from "./user.entity";

@Injectable()
export class UserService {
	public createUserWithGitHubAccount({ email, provider, providerUid, image }: RegisterGitHubAccountDto) {
		return User.save({ email, image, accounts: [{ provider, providerUid }] });
	}

	public async findUserByProvider(providerUid: string, provider: string) {
		const account = await Account.findOneBy({ providerUid, provider });
		return account ? User.findOneBy({ id: account.userId }) : null;
	}
}
