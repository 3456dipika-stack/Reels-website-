import { NextResponse } from 'next/server';
import AuthUser from '@/models/AuthUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authConnection } from '@/lib/mongodb';

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

    const token = jwt.sign(
      { userId: authUser._id, username: authUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An error occurred during login.', error: error.message }, { status: 500 });
  }
}