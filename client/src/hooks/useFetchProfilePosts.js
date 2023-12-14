import axios from "axios";
import { useEffect, useState } from "react";

const useFetchProfilePosts = (page) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetchNew, setFetchNew] = useState(true);

  useEffect(() => {
    if (!fetchNew) return;

    setLoading(true);

    axios
      .get(`/api/posts/my-posts?page=${page}`)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          if (page === 1) {
            setPosts(response.data);
          } else if (response.data.length === 0) {
            setFetchNew(false);
          } else {
            setPosts((prev) => {
              return [...new Set([...prev, ...response.data])];
            });
          }
        } else {
          throw new Error();
        }
      })
      .catch((e) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  return { posts, fetchNew, loading, error };
};

export default useFetchProfilePosts;
