import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "../user/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	public constructor() {
		super();
	}

	public serializeUser(user: User, done: CallableFunction) {
		done(null, user.id);
	}

	public async deserializeUser(id: string, done: CallableFunction) {
		const user = await User.findOneBy({ id });
		done(null, user?.id);
	}
}
