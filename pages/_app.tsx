import type { AppProps } from 'next/app';
import { MessageProvider } from '../src/context/MessageContext';
import MessageDisplay from '../src/components/MessageDisplay';
import '../src/styles/globals.css';
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

  if (!isAuth) return null;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-xl font-bold text-blue-700 tracking-tight hover:text-blue-900 transition-colors">Admin Dashboard</Link>
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Dashboard</Link>
      </div>
      <div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuth(!!localStorage.getItem('token'));
    }
  }, [router.asPath]);

  const isLoginPage = router.pathname === '/login';

  return (
    <MessageProvider>
      {!isLoginPage && isAuth && <NavBar />}
      <MessageDisplay />
      <main className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
      </main>
    </MessageProvider>
  );
} 