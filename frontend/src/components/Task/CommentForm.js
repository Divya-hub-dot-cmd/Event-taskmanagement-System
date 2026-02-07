import { useState } from "react";
import toast from "react-hot-toast";

const CommentForm = ({ taskId, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comment", comment);
      files.forEach((f) => formData.append("files", f));

      await onSubmit(formData);

      setComment("");
      setFiles([]);
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="mt-4">
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <input
        type="file"
        multiple
        className="mt-2"
        onChange={(e) => setFiles([...e.target.files])}
      />

      {files.length > 0 && (
        <ul className="text-sm text-gray-500 mt-1">
          {files.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentForm;
