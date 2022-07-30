import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import { Transaction } from "../transaction/transaction.entity";

@Entity()
export class Category extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@OneToMany(() => Transaction, transaction => transaction.category, { cascade: true })
	public transactions: Transaction[];

	@Column({ unique: true })
	public name: string;
}
