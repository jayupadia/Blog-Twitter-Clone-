import { useState } from 'react';
import axios from 'axios';

const BlogCard = ({ blog }) => {
  const [likes, setLikes] = useState(blog.likes.length);
  const [comments, setComments] = useState(blog.comments);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/blogs/${blog._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikes(response.data.likes.length); // Update likes count
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/blogs/${blog._id}/comment`, {
        text: newComment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments([...comments, response.data.comment]); // Update comments
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h2 className="text-xl font-bold">{blog.title}</h2>
      <p>{blog.content}</p>
      <div className="flex items-center mt-4">
        <button
          onClick={handleLike}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Like ({likes})
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment._id} className="mt-2 p-2 border rounded">
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}

        <form onSubmit={handleCommentSubmit} className="mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="mt-2 p-2 bg-green-500 text-white rounded">
            Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogCard;
