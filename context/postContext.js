import { createContext, useCallback, useReducer, useState } from 'react';

const PostsContext = createContext();

const postsReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_POSTS': {
      const newPosts = [...state];
      payload.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      const newState = newPosts.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      return newState;
    }
    case 'DELETE_POST': {
      const newState = state.filter((post) => post._id !== payload);
      return newState;
    }
    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const getPosts = useCallback(
    async ({ lastPostDate, getNewerPosts = false }) => {
      const res = await fetch('/api/getPosts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lastPostDate, getNewerPosts }),
      });

      const json = await res.json();
      const result = json.posts;
      if (result.length < 5) {
        setNoMorePosts(true);
      }
      dispatch({
        type: 'ADD_POSTS',
        payload: result,
      });
    },
    []
  );

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({
      type: 'ADD_POSTS',
      payload: postsFromSSR,
    });
  }, []);

  const deletePost = useCallback((postId) => {
    dispatch({
      type: 'DELETE_POST',
      payload: postId,
    });
  }, []);

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, deletePost, noMorePosts }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
