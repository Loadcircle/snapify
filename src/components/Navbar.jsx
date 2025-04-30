'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show navbar on auth pages
  if (pathname.startsWith('/auth/')) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-orange-500">
              Snapify
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-4 flex items-center">
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : session ? (
                <div className="relative ml-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm rounded-full focus:outline-none"
                      onClick={toggleMenu}
                    >
                      {session.user.image ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={session.user.image}
                          alt={session.user.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-gray-500">{session.user.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mi Dashboard
                      </Link>
                      {session.user.role === 'admin' && (
                        <Link 
                          href="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/auth/signin"
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {status === 'loading' ? (
            <div className="flex items-center px-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="ml-3 w-24 h-5 rounded bg-gray-200 animate-pulse"></div>
            </div>
          ) : session ? (
            <>
              <div className="flex items-center px-4">
                {session.user.image ? (
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={session.user.image}
                      alt={session.user.name}
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{session.user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Dashboard
                </Link>
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setIsMenuOpen(false);
                  }}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1 px-2">
              <Link
                href="/auth/signin"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 