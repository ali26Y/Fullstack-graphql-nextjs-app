import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: "id" | "createdAt" | "updatedAt";

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  password!: string;
}
