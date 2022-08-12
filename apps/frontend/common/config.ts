import Joi from "joi";

interface Environment {
	WS_ENDPOINT: string;
}

class EnvService {
	private readonly environment: Environment;

	public constructor() {
		this.environment = Joi.attempt(
			{
				WS_ENDPOINT: process.env.NX_WS_ENDPOINT,
			},
			Joi.object<Environment>({
				WS_ENDPOINT: Joi.string().required(),
			}).unknown(true)
		);
	}

	public get<T>(name: keyof Environment) {
		return this.environment[name] as unknown as T;
	}
}

const env = new EnvService();

export default env;
