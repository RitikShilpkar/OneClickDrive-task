import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMessages } from "../src/context/MessageContext";
import { HiOutlineLockClosed } from 'react-icons/hi';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addMessage } = useMessages();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem("token", "mock-token");
      document.cookie = "token=mock-token; path=/";
      addMessage('success', 'Login successful!');
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      addMessage('error', data.message || 'Incorrect username or password');
      setLoading(false);
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-200 px-4">
      <div className="w-[50%] max-w-md bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 bg-red-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 text-blue-600 rounded-full p-4 shadow-lg bg-red-200">
            <HiOutlineLockClosed className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
              placeholder="e.g. admin@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}