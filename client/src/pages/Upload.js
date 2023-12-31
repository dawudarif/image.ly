import { useRef, useState } from "react";
import { FaFileImage } from "react-icons/fa";
import axios from "axios";
import { FiPaperclip } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Ring from "../components/loading/ring";
import imageCompression from "browser-image-compression";

function UploadImage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(undefined);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitImage = async () => {
    setLoading(true);

    try {
      setMessage("uploading...");

      const api = await axios.get(
        `/api/posts/get-upload-url?type=${file?.type}`,
      );
      const url = api.data.url;
      const key = api.data.key;

      await axios.put(url, file, {
        "Content-Type": file?.type,
      });

      const data = {
        media: key,
        mediaType: file?.type,
        text: caption,
      };

      await axios.post(`/api/posts/create-post`, data);

      setMessage("media uploaded");

      navigate("/", { replace: true });
    } catch (error) {
      setMessage(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    setMessage("");
    const file = e.target.files?.[0] ?? null;
    const size = file?.size / (1024 * 1024);
    if (size > 3) {
      setMessage("File should be smaller than 3Mbs");
      setFile(undefined);
    } else {
      const compressedFile = await imageCompression(file, {
        useWebWorker: true,
        // maxWidthOrHeight: Math.max(640, 450),
        maxSizeMB: 0.45,
      });
      setFile(compressedFile);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  return (
    <div className="flex h-[90vh] flex-row items-center justify-center gap-6 bg-black text-white sm:flex-col sm:gap-2 xs:flex-col xs:gap-2">
      <div>
        {previewUrl && file ? (
          <div className="mt-4">
            {file.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Selected file"
                className="h-[15rem] w-[15rem] rounded-md border  border-white object-cover shadow-sm shadow-white"
              />
            ) : (
              file.type.startsWith("video/") && (
                <video
                  src={previewUrl}
                  controls
                  className="h-[15rem] w-[15rem] rounded-md border  border-white object-cover shadow-sm shadow-white"
                />
              )
            )}
          </div>
        ) : (
          <div className="flex h-[15rem] w-[15rem] items-center  justify-center rounded-md border border-white shadow-sm shadow-white">
            <FaFileImage size={30} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-baseline justify-center gap-6">
        <pre>{message}</pre>
        <input
          type="file"
          accept="image/jpeg, image/png, video/mp4"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className="flex items-center justify-center">
          <div className="mr-2 rounded-md p-4 transition-all duration-300 hover:bg-[#252525]">
            <FiPaperclip
              onClick={() => fileInputRef.current.click()}
              color="white"
              size={25}
            />
          </div>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption"
            className="rounded-md border border-white bg-black p-4 px-6 font-medium text-white"
          />
        </div>
        <button
          onClick={submitImage}
          className={`rounded-md border border-white bg-black p-4 px-32 font-bold text-white ${
            !loading && "hover:bg-white hover:text-black"
          } w-[100%] transition-colors duration-300`}
          disabled={loading}
        >
          {loading ? <Ring size={22} /> : <> Submit </>}
        </button>
      </div>
    </div>
  );
}

export default UploadImage;
