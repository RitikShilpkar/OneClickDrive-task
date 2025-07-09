import { GetServerSideProps } from 'next';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TableRow from '../../src/components/TableRow';
import { HiOutlinePlus, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineClipboardList } from 'react-icons/hi';

const LIMIT = 5;

interface Listing {
  id: number;
  title: string;
  status: string;
  price: number;
  location: string;
  owner: string;
}

interface DashboardProps {
  listings: Listing[];
  page: number;
  status: string;
  totalPages: number;
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (context) => {
  const { page = 1, status = "all" } = context.query;
  const baseUrl = context.req.headers.host ? `http://${context.req.headers.host}` : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/listings?page=${page}&limit=${LIMIT}&status=${status}`);
  const data = await res.json();
  const totalPages = Math.ceil(data.total / LIMIT);
  return {
    props: {
      listings: data.listings,
      page: Number(page),
      status: String(status),
      totalPages,
    },
  };
};

export default function DashboardPage({ listings: initialListings, page, status, totalPages }: DashboardProps) {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);
  const [loading, setLoading] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) router.replace("/login");
    }
  }, [router]);

  const fetchListings = async () => {
    setLoading(true);
    const res = await fetch(`/api/listings?page=${page}&limit=${LIMIT}&status=${status}`);
    const data = await res.json();
    setListings(data.listings);
    setLoading(false);
  };

  const sortedListings = [...listings].sort((a, b) => b.id - a.id);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 space-y-4 sm:space-y-0">
        <div>
          <h1 className="flex items-center text-4xl font-extrabold text-gray-900 gap-3">
            <HiOutlineClipboardList className="text-blue-600" />
            Car Rental Listings
          </h1>
          <p className="mt-2 text-gray-600 text-lg">Manage, approve, reject, or edit user-submitted car rental listings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            <HiOutlinePlus className="text-xl" />
            Add New Listing
          </Link>
          <Link
            href="/dashboard/audit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            <HiOutlineClipboardList className="text-xl" />
            View Audit Log
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 mb-8 shadow">
        <form method="GET" action="/dashboard" className="flex flex-wrap items-center gap-3">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">Status:</label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="h-10 px-3 rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <input type="hidden" name="page" value={1} />
          <button type="submit" className="h-10 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Apply
          </button>
        </form>
        <Link href="/dashboard/audit" className="mt-4 md:mt-0 text-blue-600 hover:text-blue-800 font-medium text-sm">
          View Audit Log
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <span className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></span>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {['Title','Owner','Location','Price','Status','Actions'].map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-lg flex flex-col items-center gap-2">
                  <HiOutlineClipboardList className="text-6xl" />
                  No listings found.
                </td>
              </tr>
            ) : (
              sortedListings.map((listing, idx) => (
                <TableRow
                  key={listing.id}
                  listing={listing}
                  className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                  onStatusChange={fetchListings}
                  loadingRowId={loadingRowId}
                  setLoadingRowId={setLoadingRowId}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {page > 1 && (
          <Link
            href={`/dashboard?page=${page - 1}&status=${status}`}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-blue-50 transition"
          >
            <HiOutlineArrowLeft className="text-lg" />
            Previous
          </Link>
        )}
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i + 1}
            href={`/dashboard?page=${i + 1}&status=${status}`}
            className={`px-4 py-2 border rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
              i + 1 === page
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            {i + 1}
          </Link>
        ))}
        {page < totalPages && (
          <Link
            href={`/dashboard?page=${page + 1}&status=${status}`}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-blue-50 transition"
          >
            Next
            <HiOutlineArrowRight className="text-lg" />
          </Link>
        )}
      </div>
    </div>
  );
}
