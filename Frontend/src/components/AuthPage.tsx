import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Auth Type Selector */}
          <div className="flex">
            <button
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                isSignIn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                !isSignIn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
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