import { NextResponse } from 'next/server';
import Reel from '@/models/Reel';
import User from '@/models/User';
import { reelsConnection, usersConnection } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(request, { params }) {
  try {
    const { reelId } = params;

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

    // 3. Find the reel and toggle the like
    await reelsConnection;
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return NextResponse.json({ message: 'Reel not found.' }, { status: 404 });
    }

    const hasLiked = reel.likes.includes(userProfileId);

    if (hasLiked) {
      // Unlike the reel
      reel.likes.pull(userProfileId);
    } else {
      // Like the reel
      reel.likes.push(userProfileId);
    }

    const updatedReel = await reel.save();

    return NextResponse.json({ message: 'Like status updated.', reel: updatedReel }, { status: 200 });

  } catch (error) {
    console.error('Like Reel Error:', error);
    return NextResponse.json({ message: 'An error occurred while updating the like status.', error: error.message }, { status: 500 });
  }
}