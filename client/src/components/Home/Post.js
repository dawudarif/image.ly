import axios from "axios";
import { MdDelete } from "react-icons/md";
import { TbDownload } from "react-icons/tb";
import { useSelector } from "react-redux";
import { HiMiniHeart } from "react-icons/hi2";

const Post = ({ post, data, setData }) => {
  const mediaType = post.mediaType ? post.mediaType.split("/")[0] : null;
  const state = useSelector((store) => store.account.userProfile);

  const deletePost = async (id) => {
    const post = await axios.delete(`/api/posts/delete-post/${id}`, {
      withCredentials: true,
    });

    const deleteId = post.data.id;

    if (deleteId) {
      const filteredPosts = data.filter((post) => deleteId !== post.id);

      setData(filteredPosts);
    }
  };

  const likePost = async (id) => {
    const post = await axios.put(`/api/posts/add-like/${id}`, {
      withCredentials: true,
    });

    const response = post.data;

    if (response) {
      const updatedData = data.map((post) => {
        if (post.id === response.postId) {
          return {
            ...post,
            _count: { likes: post._count.likes + 1 },
            likes: {
              id: response.id,
              accountId: response.accountId,
            },
          };
        }
        return post;
      });

      setData(updatedData);
    }
  };

  const removeLike = async (postId, like) => {
    const body = { id: postId, likeId: like };

    const post = await axios.put(`/api/posts/remove-like`, body, {
      withCredentials: true,
    });

    const response = post.data;

    if (response) {
      const updatedData = data.map((post) => {
        if (post.id === response.postId) {
          return {
            ...post,
            _count: { likes: post._count.likes - 1 },
            likes: undefined,
          };
        }
        return post;
      });

      setData(updatedData);
    }
  };

  if (!post || !state) {
    return;
  }

  const liked = post.likes && post.likes?.accountId === state.id;

  return (
    <div key={post.id} className="rounded-md border border-[#252525] p-0">
      <div className="flex items-center justify-start gap-2 p-2">
        <img
          src={post.createdBy.imgUrl}
          alt={post.createdBy.name}
          className="h-8 w-8 rounded-[50%] border border-[#252525] object-cover"
        />
        <p className="font-sans text-sm font-bold text-white">
          {post.createdBy.username}
        </p>
      </div>
      {mediaType === "image" ? (
        <img
          src={post.media}
          alt={post.id}
          loading="lazy"
          className="min-h-[20rem] overflow-hidden rounded-sm object-contain"
        />
      ) : (
        <video
          src={post.media}
          autoPlay
          controls
          muted
          autoplay
          loop
          controlsList="nodownload"
          className="max-h-[80vh] min-h-[20rem] w-[100%] overflow-hidden rounded-sm object-cover"
        />
      )}

      <div className="mt-2 flex items-center justify-between p-4">
        <p className="font-medium text-white">{post.caption}</p>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-1">
            <p className="text-white">{post._count.likes}</p>
            <HiMiniHeart
              size={24}
              color={!!liked ? "#e74032" : "white"}
              onClick={
                !!liked
                  ? () => removeLike(post.id, post.likes.id)
                  : () => likePost(post.id)
              }
            />
          </div>

          <a id="downloadLink" href={post.media} download={post.caption}>
            <TbDownload color="white" size={20} />
          </a>
          {post.createdBy.id === state.id && (
            <MdDelete
              color="white"
              size={20}
              onClick={() => deletePost(post.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
