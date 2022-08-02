import { Difficulty } from "@shared";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

@Entity()
export class Leaderboard extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column()
	public score: number;

	@Column({ type: "enum", enum: difficulties, default: "easy" })
	public difficulty: Difficulty;

	@Column()
	public name: string;
}
