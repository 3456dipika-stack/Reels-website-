'use client';

import { useState } from 'react';
import { getAuthToken } from '@/lib/auth';

const CommentSection = ({ reelId, comments, onCommentPosted }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const token = getAuthToken();
    if (!token) {
      setError('You must be logged in to comment.');
      setIsSubmitting(false);
      return;
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/reels/${reelId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        onCommentPosted(data.reel.comments); // Callback to update parent state
        setNewComment('');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to post comment.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-75 transform translate-y-full transition-transform duration-300 ease-in-out">
      <div className="h-64 overflow-y-auto mb-4">
        <h4 className="text-lg font-semibold mb-2 text-white">Comments ({comments.length})</h4>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="text-white mb-2 text-sm">
              {/* In a real app, you would populate the username here */}
              <span className="font-bold">user_{comment.user.toString().slice(-4)}: </span>
              <span>{comment.text}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        )}
      </div>
      <form onSubmit={handleSubmitComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" disabled={isSubmitting} className="w-full mt-2 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-500">
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CommentSection;