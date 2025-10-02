import { NextResponse } from 'next/server';
import AuthUser from '@/models/AuthUser';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authConnection, usersConnection } from '@/lib/mongodb';

export async function POST(request) {
  try {
    await authConnection;
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password.' }, { status: 400 });
    }

    const authUser = await AuthUser.findOne({ email });
    if (!authUser) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, authUser.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // Find the corresponding user profile to include its ID in the token
    await usersConnection;
    const userProfile = await User.findOne({ authId: authUser._id });
    if (!userProfile) {
      // This case should not happen in a consistent database.
      return NextResponse.json({ message: 'Could not find a user profile for the authenticated user.' }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: authUser._id, username: authUser.username, profileId: userProfile._id },
      "a-secure-secret-for-jwt-signing",
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An error occurred during login.', error: error.message }, { status: 500 });
  }
}