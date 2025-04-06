import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <nav className="flex justify-end space-x-9 mb-4 border-b pb-2">
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
      </nav>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl text-center mb-4">Welcome to DriveShare</h1>
        <p className="text-lg text-center">
          Navigate using the menu above to log in, create a new listing, or view your dashboard.
        </p>
      </div>
    </div>
  );
}