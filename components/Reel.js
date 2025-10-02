'use client';

import React, { useRef, useEffect } from 'react';

const Reel = ({ reel }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0; // Optional: Reset video on scroll away
        }
      },
      {
        threshold: 0.5, // Play when 50% of the video is visible
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  if (!reel) {
    return null;
  }

  return (
    <div className="relative h-screen w-full snap-start flex justify-center items-center bg-black">
      <div className="relative w-full max-w-md h-[90vh] bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={reel.videoUrl}
          loop
          playsInline
        />
        <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
          <h3 className="font-bold text-lg">@{reel.user?.username || 'unknown_user'}</h3>
          <p className="text-sm">{reel.caption}</p>
        </div>
      </div>
    </div>
  );
};

export default Reel;