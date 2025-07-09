import { useState } from "react";
import { useRouter } from "next/router";
import { useMessages } from "../src/context/MessageContext";
import { HiOutlineLockClosed } from 'react-icons/hi';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addMessage } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (username && password) {
      localStorage.setItem("token", "mock-token");
      addMessage('success', 'Login successful!');
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      addMessage('error', 'Username and password are required');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-8 sm:p-10 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="bg-blue-100 text-blue-600 rounded-full p-3 mb-2">
            <HiOutlineLockClosed className="text-2xl" />
          </span>
          <h2 className="text-2xl font-bold text-gray-900 text-center">Admin Login</h2>
          <p className="text-gray-500 text-center text-base">Sign in to access the admin dashboard</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 px-4 border border-transparent text-base font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
} 