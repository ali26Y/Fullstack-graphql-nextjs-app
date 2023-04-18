import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  username!: string;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  password!: string;
}
