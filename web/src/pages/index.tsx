import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useQuery } from "urql";
import { postsQuery } from "../graphql/queries/posts";

type Posts = {
  id: number;
  title: string;
};

const Index = () => {
  const [{ data, fetching }] = useQuery({
    query: postsQuery,
  });

  console.log("data", data, fetching);

  return (
    <>
      <NavBar />
      <div>hello world</div>
      {!data
        ? null
        : data.posts.map((p: Posts) => <div key={p.id}>{p.title}</div>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
