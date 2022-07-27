import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	BaseEntity,
} from "typeorm";
import { Account } from "../account/account.entity";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@OneToMany(() => Account, account => account.user, { cascade: true })
	public accounts: Account[];

	@Column({ unique: true })
	public email: string;

	@Column({ type: "text", nullable: true })
	public image: string | null;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;
}
