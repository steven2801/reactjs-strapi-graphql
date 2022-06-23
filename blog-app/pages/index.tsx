import type { NextPage } from "next";
import { useQuery, gql, useMutation } from "@apollo/client";

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

const CREATE_POST_MUTATION = gql`
	mutation createPost($title: String!, $content: String!) {
		createPost(data: { title: $title, content: $content }) {
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

const UPDATE_POST_MUTATION = gql`
	mutation updatePost($id: ID!, $title: String!, $content: String) {
		updatePost(id: $id, data: { title: $title, content: $content }) {
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

const DELETE_POST_MUTATION = gql`
	mutation deletePost($id: ID!) {
		deletePost(id: $id) {
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
	const { loading, error, data, refetch } = useQuery(POSTS);

	const [createPost] = useMutation(CREATE_POST_MUTATION);
	const [updatePost] = useMutation(UPDATE_POST_MUTATION);
	const [deletePost] = useMutation(DELETE_POST_MUTATION);

	const addPost = async () => {
		await createPost({ variables: { title: "dasdas", content: "dsadsa" } });
		refetch();
	};

	const editPost = async () => {
		await updatePost({ variables: { id: 56, title: "bedsas" } });
	};

	const removePost = async () => {
		await deletePost({ variables: { id: 57 } });
		refetch();
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>An error occurred.</div>;

	return (
		<div style={{ display: "flex", flexWrap: "wrap" }}>
			{/* Only 1 data is retrieved (filtering by id) */}
			{/* <div
				key={data.post.data.id}
				style={{ backgroundColor: "#b5b5b5", padding: "8px", margin: "8px", width: "400px" }}
			>
				<p>{data.post.data.attributes.title}</p>
				<p>{data.post.data.attributes.content}</p>
			</div> */}

			{/* Multiple data is retrieved (either get all or using the strapi filters api) */}
			{data.posts.data.map((post: Post) => {
				return (
					<div key={post.id} style={{ backgroundColor: "#b5b5b5", padding: "8px", margin: "8px", width: "400px" }}>
						<p>{post.attributes.title}</p>
						<p>{post.attributes.content}</p>
					</div>
				);
			})}

			<button onClick={addPost}>Add Post</button>
			<button onClick={editPost}>Edit Post</button>
			<button onClick={removePost}>Remove Post</button>
		</div>
	);
};

export default Home;
