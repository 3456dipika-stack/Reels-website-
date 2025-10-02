import { NextResponse } from 'next/server';
import Reel from '@/models/Reel';
import User from '@/models/User';
import { reelsConnection, usersConnection } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(request, { params }) {
  try {
    const { reelId } = params;
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ message: 'Comment text is required.' }, { status: 400 });
    }

    // 1. Authenticate the user
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization header missing or invalid.' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    const { userId: authId } = decoded;

    // 2. Find the user's profile ID
    await usersConnection;
    const userProfile = await User.findOne({ authId });
    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
    }
    const userProfileId = userProfile._id;

    // 3. Find the reel and add the comment
    await reelsConnection;
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return NextResponse.json({ message: 'Reel not found.' }, { status: 404 });
    }

    const newComment = {
      user: userProfileId,
      text: text.trim(),
    };

    reel.comments.push(newComment);
    const updatedReel = await reel.save();

    return NextResponse.json({ message: 'Comment added successfully.', reel: updatedReel }, { status: 201 });

  } catch (error) {
    console.error('Add Comment Error:', error);
    return NextResponse.json({ message: 'An error occurred while adding the comment.', error: error.message }, { status: 500 });
  }
}