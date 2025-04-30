'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An authentication error occurred';

  // Map error codes to user-friendly messages
  if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid email or password';
  } else if (error === 'OAuthAccountNotLinked') {
    errorMessage = 'This email is already associated with another account';
  } else if (error === 'EmailSignin') {
    errorMessage = 'Error sending login email';
  } else if (error === 'Callback') {
    errorMessage = 'There was an error during the sign in process';
  } else if (error === 'OAuthCallback') {
    errorMessage = 'Error during OAuth authentication';
  } else if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You do not have permission to view this page';
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Sign In
            </Link>
            <Link 
              href="/" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 