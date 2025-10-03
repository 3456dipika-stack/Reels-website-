import { NextResponse } from 'next/server';
import Reel from '@/models/Reel';
import User from '@/models/User';
import { reelsConnection, usersConnection } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

// GET all reels
export async function GET(request) {
  try {
    await reelsConnection;
    await usersConnection;

    const reels = await Reel.find({})
      .populate({
        path: 'user',
        model: User, // Explicitly specify the model to populate from the usersConnection
        select: 'username',
      })
      .sort({ createdAt: 'desc' });

    return NextResponse.json({ reels }, { status: 200 });
  } catch (error) {
    console.error('Get Reels Error:', error);
    return NextResponse.json({ message: 'An error occurred while fetching reels.', error: error.message }, { status: 500 });
  }
}

// POST a new reel
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization header missing or invalid.' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, "this-is-a-very-secure-secret-and-should-be-changed");
    } catch (e) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    const { userId: authId } = decoded; // This is the ID from the AuthUser model

    // Find the corresponding User profile document
    await usersConnection;
    const userProfile = await User.findOne({ authId });

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
    }

    await reelsConnection;
    const { videoUrl, caption } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ message: 'Missing videoUrl.' }, { status: 400 });
    }

    const newReel = new Reel({
      videoUrl,
      caption,
      user: userProfile._id, // Use the ID from the User model
    });

    await newReel.save();

    return NextResponse.json({ message: 'Reel uploaded successfully.', reel: newReel }, { status: 201 });
  } catch (error) {
    console.error('Upload Reel Error:', error);
    return NextResponse.json({ message: 'An error occurred while uploading the reel.', error: error.message }, { status: 500 });
  }
}