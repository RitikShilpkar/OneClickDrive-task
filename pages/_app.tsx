import type { AppProps } from 'next/app';
import { MessageProvider } from '../src/context/MessageContext';
import MessageDisplay from '../src/components/MessageDisplay';
import '../src/globals.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function NavBar() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuth(!!localStorage.getItem('token'));
    }
  }, [router.asPath]);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-xl font-bold text-blue-700 tracking-tight hover:text-blue-900 transition-colors">Admin Dashboard</Link>
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Dashboard</Link>
        <Link href="/dashboard/audit" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Audit Log</Link>
      </div>
      <div>
        {isAuth ? (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MessageProvider>
      <NavBar />
      <MessageDisplay />
      <main className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
      </main>
    </MessageProvider>
  );
} 