import { Injectable } from "@nestjs/common";
import { Account } from "./account.entity";

@Injectable()
export class AccountService {
	public findGitHubAccount(providerUid: string) {
		return Account.findOneBy({ providerUid });
	}
}
