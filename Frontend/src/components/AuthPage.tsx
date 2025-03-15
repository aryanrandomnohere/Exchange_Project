import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-300">
          {/* Auth Type Selector */}
          <div className="flex border-b border-gray-300">
            <button
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                isSignIn
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                !isSignIn
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Welcome to Exchange
            </h2>
            {isSignIn ? <SignIn /> : <SignUp />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
