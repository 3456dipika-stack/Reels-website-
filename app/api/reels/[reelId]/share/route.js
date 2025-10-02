import { NextResponse } from 'next/server';
import Reel from '@/models/Reel';
import { reelsConnection } from '@/lib/mongodb';

export async function POST(request, { params }) {
  try {
    const { reelId } = params;

    await reelsConnection;
    const reel = await Reel.findById(reelId);

    if (!reel) {
      return NextResponse.json({ message: 'Reel not found.' }, { status: 404 });
    }

    // Increment the share count
    reel.shareCount += 1;
    const updatedReel = await reel.save();

    return NextResponse.json({ message: 'Share count updated.', reel: updatedReel }, { status: 200 });

  } catch (error) {
    console.error('Share Reel Error:', error);
    return NextResponse.json({ message: 'An error occurred while updating the share count.', error: error.message }, { status: 500 });
  }
}