import type { NextPage } from "next";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

const POSTS = gql`
	query GetPosts($page: Int, $pageSize: Int) {
		posts(pagination: { page: $page, pageSize: $pageSize }) {
			data {
				id
				attributes {
					title
					content
					user {
						data {
							id
							attributes {
								username
								email
							}
						}
					}
				}
			}
			meta {
				pagination {
					page
					pageSize
					pageCount
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
		user: {
			data: {
				attributes: { username: string; email: string };
			};
		};
	};
}

const Home: NextPage = () => {
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);

	const { loading, error, data, refetch } = useQuery(POSTS, {
		variables: { page, pageSize: 10 },
	});

	useEffect(() => {
		if (data) {
			console.log(data);
			const {
				posts: {
					meta: {
						pagination: { pageCount: pc },
					},
				},
			} = data;
			setPageCount(pc);
		}
	}, [data]);

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
				const {
					attributes: {
						user: { data },
					},
				} = post;
				return (
					<div key={post.id} style={{ backgroundColor: "#b5b5b5", padding: "8px", margin: "8px", width: "400px" }}>
						<p>{post.attributes.title}</p>
						<p>{post.attributes.content}</p>
						{data ? (
							<>
								<p>Created by {data.attributes.username}</p>
								<p>Email: {data.attributes.email}</p>
							</>
						) : (
							<></>
						)}
					</div>
				);
			})}

			{/* <button onClick={addPost}>Add Post</button>
			<button onClick={editPost}>Edit Post</button>
			<button onClick={removePost}>Remove Post</button> */}
			<button
				onClick={() => {
					if (page === 1) {
						return;
					}
					setPage(page - 1);
				}}
			>
				Previous Post
			</button>
			<button
				onClick={() => {
					if (page === pageCount) {
						return;
					}
					setPage(page + 1);
				}}
			>
				Next Post
			</button>
		</div>
	);
};

export default Home;
