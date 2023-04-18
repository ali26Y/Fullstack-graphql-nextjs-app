import { Post } from "../entities/Post";
import { Resolver, Mutation, Query, Arg, Int } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOneBy({ id });
  }

  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string): Promise<Post> {
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("title", () => String) title: string,
    @Arg("id", () => Int) id: number
  ): Promise<Post | null> {
    const post = await Post.findOneBy({ id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update(
        {
          id,
        },
        { title }
      );
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<Boolean> {
    await Post.delete({ id });
    return true;
  }
}
