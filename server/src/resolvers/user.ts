import { MyContext } from "../types";
import { User } from "../entities/User";
import {
  Ctx,
  Arg,
  Resolver,
  Mutation,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../sendEmail";
import { v4 } from "uuid";
import { AppDataSource } from "../typeorm.config";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    // change password
    const userIdNum = parseInt(userId);

    const user = await User.findOneBy({ id: userIdNum });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);
    // await em.persistAndFlush(user);

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    await redis.del(key);

    // login user after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { redis }: MyContext,
    @Arg("email") email: string
  ) {
    const user = await User.findOneBy({ email });
    if (!user) {
      // the email is not in the database
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3 // 3 days
    );

    sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOneBy({ id: req.session.userId });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return {
        errors,
      };
    }
    const hashedPassword = await argon2.hash(options.password);

    try {
      const userRepository = AppDataSource.getRepository(User);

      const result = await userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          email: options.email.toLowerCase(),
          username: options.username.toLowerCase(),
          password: hashedPassword,
        })
        .returning("*")
        .execute();

      // alternative way to save the user
      // await User.create({}).save();

      const user = result.raw[0];

      // this will login the user after registration
      req.session.userId = user.id;

      return { user };
      /* alternative way to persist and flush

			  import { EntityManager } from "@mikro-orm/postgresql";
			  
				const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username.toLowerCase(),
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
				console.log("resault", result);
				user = result[0];

			*/
    } catch (err) {
      console.log("err", err);
      if (err?.detail?.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
      return {
        errors: [
          {
            field: "username",
            message: "something went wrong",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOneBy({
      ...(usernameOrEmail.includes("@")
        ? { email: usernameOrEmail.toLowerCase() }
        : { username: usernameOrEmail.toLowerCase() }),
    });
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "usernameOrEmail does not exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
        return;
      })
    );
  }
}
