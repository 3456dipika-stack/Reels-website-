import { NextResponse } from 'next/server';
import AuthUser from '@/models/AuthUser';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { authConnection, usersConnection } from '@/lib/mongodb';

export async function POST(request) {
  try {
    // Ensure connections are established
    await authConnection;
    await usersConnection;

    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Check if user already exists in the auth database
    const existingAuthUser = await AuthUser.findOne({ $or: [{ email }, { username }] });
    if (existingAuthUser) {
      return NextResponse.json({ message: 'User with this email or username already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create the new user in the auth database
    const newAuthUser = new AuthUser({
      username,
      email,
      password: hashedPassword,
    });
    const savedAuthUser = await newAuthUser.save();

    try {
      // 2. Create the corresponding user profile in the users database
      const newUserProfile = new User({
        authId: savedAuthUser._id,
        username: savedAuthUser.username,
      });
      await newUserProfile.save();

      return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
    } catch (profileError) {
      // If profile creation fails, delete the orphaned auth user to maintain data consistency.
      console.error('User profile creation failed, rolling back AuthUser creation.', profileError);
      await AuthUser.findByIdAndDelete(savedAuthUser._id);
      throw profileError; // Re-throw the error to be caught by the outer catch block
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'An error occurred during registration.', error: error.message }, { status: 500 });
  }
}