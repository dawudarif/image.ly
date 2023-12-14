import axios from "axios";
import { useEffect, useState } from "react";

const useFetchData = (page) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetchNew, setFetchNew] = useState(true);

  useEffect(() => {
    if (!fetchNew) return;
    if (page === 1) {
      setLoading(true);
    } else {
      setPostLoading(true);
    }

    axios
      .get(`/api/posts/get-posts?page=${page}`)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          if (page === 1) {
            setData(response.data);
          } else if (response.data.length === 0) {
            setFetchNew(false);
          } else {
            setData((prev) => {
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
        setPostLoading(false);
      });
  }, [page]);

  return { data, loading, postLoading, error, fetchNew, setData };
};

export default useFetchData;
