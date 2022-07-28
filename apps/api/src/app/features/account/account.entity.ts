import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	BaseEntity,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Account extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@ManyToOne(() => User, user => user.accounts, { onDelete: "CASCADE", nullable: false })
	public user: User;

	@Column()
	public userId: string;

	@Column()
	public provider: string;

	@Column()
	public providerUid: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;
}
