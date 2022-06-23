import type { NextPage } from "next";
import { useQuery, gql } from "@apollo/client";

const POSTS = gql`
	query GetPosts {
		posts {
			data {
				id
				attributes {
					title
					content
				}
			}
		}
	}
`;

const POSTS_BY_TITLE = gql`
	query GetPostByTitle($title: String!) {
		posts(filters: { title: { eq: $title } }) {
			data {
				id
				attributes {
					title
					content
				}
			}
		}
	}
`;

// filtering by id uses singular naming of entity type (ex: post, instead of posts (line 35))
const POST_BY_ID = gql`
	query GetPostById($id: ID!) {
		post(id: $id) {
			data {
				id
				attributes {
					title
					content
				}
			}
		}
	}
`;

interface Post {
	id: string | number;
	attributes: {
		title: string;
		content: string;
	};
}

const Home: NextPage = () => {
	const { loading, error, data } = useQuery(POST_BY_ID, {
		variables: { id: 17 },
	});

	if (loading) return <div>Loading...</div>;
	if (error) return <div>An error occurred.</div>;

	return (
		<div style={{ display: "flex" }}>
			{/* Only 1 data is retrieved (filtering by id) */}
			<div
				key={data.post.data.id}
				style={{ backgroundColor: "#b5b5b5", padding: "8px", margin: "8px", width: "400px" }}
			>
				<p>{data.post.data.attributes.title}</p>
				<p>{data.post.data.attributes.content}</p>
			</div>

			{/* Multiple data is retrieved (either get all or using the strapi filters api) */}
			{/* {data.posts.data.map((post: Post) => {
				return (
					<div key={post.id} style={{ backgroundColor: "#b5b5b5", padding: "8px", margin: "8px", width: "400px" }}>
						<p>{post.attributes.title}</p>
						<p>{post.attributes.content}</p>
					</div>
				);
			})} */}
		</div>
	);
};

export default Home;
