const CommentList = ({
  comments,
  users = [],
  currentUser,
  onDelete,
}) => {

  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.name : userId;
  };

  const canDelete = (comment) => {
    if (!currentUser) return false;
    return (
      comment.userId === currentUser.userId ||
      ["organizer", "admin"].includes(currentUser.role)
    );
  };

  return (
    <div className="mt-4 space-y-3">
      {comments.map((c) => (
        <div
          key={c.commentId}
          className="border p-3 rounded bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <strong>
              {getUserName(c.userId)} ({c.role})
            </strong>

            {canDelete(c) && (
              <button
                onClick={() => onDelete(c.commentId)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            )}
          </div>

          <p className="mt-1">{c.comment}</p>

          {c.attachments?.map((file, i) => (
            <a
              key={i}
              href={`http://localhost:5000/${file}`}
              target="_blank"
              rel="noreferrer"
              className="block text-blue-500 text-sm"
            >
              View Attachment
            </a>
          ))}

          <small className="text-gray-400 block mt-1">
            {new Date(c.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
