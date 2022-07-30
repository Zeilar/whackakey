import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	BaseEntity,
} from "typeorm";
import { Category } from "../category/category.entity";
import { User } from "../user/user.entity";

@Entity()
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@ManyToOne(() => User, user => user.transactions, { onDelete: "CASCADE", nullable: false })
	public user: User;

	@ManyToOne(() => Category, category => category.transactions, { onDelete: "CASCADE", nullable: false })
	public category: Category;

	@Column()
	public sek: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;
}
