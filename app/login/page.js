'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Placeholder for the auth utility I'll create in the next step
const saveAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        saveAuthToken(data.token);
        router.push('/');
      } else {
        setError(data.message || 'An error occurred during login.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login to Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Login
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
        <p className="mt-4 text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}