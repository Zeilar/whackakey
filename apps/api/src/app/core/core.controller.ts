import { Controller } from "@nestjs/common";
import { CoreService } from "./core.service";

@Controller()
export class CoreController {
	public constructor(private readonly coreService: CoreService) {}
}
