import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useQuery } from "urql";
import { postsQuery } from "../graphql/queries/posts";
import { isServer } from "../utils/isServer";

type Posts = {
  id: number;
  title: string;
};

const Index = () => {
  const [{ data, fetching }] = useQuery({
    query: postsQuery,
    pause: isServer(),
  });

  return (
    <>
      <NavBar />
      <div>hello world</div>
      {fetching || !data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p: Posts) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
