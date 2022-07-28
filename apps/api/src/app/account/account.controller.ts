import { Controller } from "@nestjs/common";
import { AccountService } from "./account.service";

@Controller()
export class AccountController {
	public constructor(private readonly accountService: AccountService) {}
}
