'use client';

export default function LoginSection({ handleLogin, email, setEmail, password, setPassword, error }) {
  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
        className="block w-full mb-2 p-2 border"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
        className="block w-full mb-2 p-2 border"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Log In
      </button>
      <p className="mt-4 text-sm">
        Don’t have an account? <a href="/signup" className="text-blue-500 underline">Sign up</a>
      </p>
    </form>
  );
}