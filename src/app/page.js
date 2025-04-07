'use client';

import Link from 'next/link';
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import LogoutButton from "./components/LogoutButton"; // Adjust the path if needed
import SearchListings from './search/page';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <nav className="flex justify-between mb-4 border-b pb-2">
        <div className="flex items-center space-x-4">
          {user && <LogoutButton />}
          {user && <span className="text-blue-500">{user.email}</span>}
        </div>
        <div className="flex items-center space-x-9">
          {user ? (
            <>
              <Link href="/listing" className="text-blue-500 hover:underline">
                New Listing
              </Link>
              <Link href="/dashboard" className="text-blue-500 hover:underline">
                Dashboard
              </Link>
              <Link href="/messaging" className="text-blue-500 hover:underline">
                Messaging
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
              <Link href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
              <Link href="/listing" className="text-blue-500 hover:underline">
                New Listing
              </Link>
              <Link href="/dashboard" className="text-blue-500 hover:underline">
                Dashboard
              </Link>
              <Link href="/messaging" className="text-blue-500 hover:underline">
                Messaging
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl text-center mb-4">Welcome to DriveShare</h1>
        <p className="text-lg text-center">
          Navigate using the menu above to log in, create a new listing, or view your dashboard.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <SearchListings />
      </div>
    </div>
  );
}