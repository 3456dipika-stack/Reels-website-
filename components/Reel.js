'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getAuthToken, getUserFromToken } from '@/lib/auth';
import CommentSection from './CommentSection'; // Import the new component

const Reel = ({ reel }) => {
  const videoRef = useRef(null);

  const currentUser = getUserFromToken();
  const [isLiked, setIsLiked] = useState(currentUser ? reel.likes.includes(currentUser.profileId) : false);
  const [likesCount, setLikesCount] = useState(reel.likes.length);
  const [comments, setComments] = useState(reel.comments);
  const [shareCount, setShareCount] = useState(reel.shareCount);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  const handleLike = async () => {
    const token = getAuthToken();
    if (!token) {
      alert('You must be logged in to like a reel.');
      return;
    }

    try {
      const res = await fetch(`/api/reels/${reel._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLikesCount(data.reel.likes.length);
        setIsLiked(data.reel.likes.includes(currentUser.profileId));
      } else {
        console.error('Failed to like the reel');
      }
    } catch (error) {
      console.error('An error occurred while liking the reel:', error);
    }
  };

  const handleShare = async () => {
    try {
      const res = await fetch(`/api/reels/${reel._id}/share`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setShareCount(data.reel.shareCount);
      } else {
        console.error('Failed to share the reel');
      }
    } catch (error) {
      console.error('An error occurred while sharing the reel:', error);
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleCommentPosted = (newComments) => {
    setComments(newComments);
  };

  if (!reel) {
    return null;
  }

  return (
    <div className="relative h-screen w-full snap-start flex justify-center items-center bg-black overflow-hidden">
      <div className="relative w-full max-w-md h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={reel.videoUrl}
          loop
          playsInline
          muted
          onClick={() => setShowComments(false)} // Hide comments when video is clicked
        />
        <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
          <h3 className="font-bold text-lg">@{reel.user?.username || 'unknown_user'}</h3>
          <p className="text-sm">{reel.caption}</p>
        </div>
        <div className="absolute right-2 bottom-4 flex flex-col items-center space-y-6 text-white">
          <button onClick={handleLike} className="flex flex-col items-center">
            <svg className={`w-8 h-8 ${isLiked ? 'text-red-500' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
            <span className="text-sm font-semibold">{likesCount}</span>
          </button>
          <button onClick={handleComment} className="flex flex-col items-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.894 8.894 0 01-4.43-1.232l-2.138.687a1 1 0 01-1.25-1.25l.687-2.138A8.894 8.894 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.43 14.768a7.001 7.001 0 0011.14 0l-1.8-1.8a1 1 0 01-1.414 0l-1.586-1.586a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 01-1.414 0L4.43 14.768z" clipRule="evenodd"></path></svg>
            <span className="text-sm font-semibold">{comments.length}</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
            <span className="text-sm font-semibold">{shareCount}</span>
          </button>
        </div>
        {/* Conditionally render the CommentSection */}
        <div className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-in-out ${showComments ? 'translate-y-0' : 'translate-y-full'}`}>
            <CommentSection reelId={reel._id} comments={comments} onCommentPosted={handleCommentPosted} />
        </div>
      </div>
    </div>
  );
};

export default Reel;