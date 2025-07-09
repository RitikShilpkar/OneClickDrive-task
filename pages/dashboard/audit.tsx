import { useEffect, useState } from 'react';
import Link from "next/link";

interface AuditEntry {
  action: string;
  listingId: number;
  admin: string;
  timestamp: string;
}

export default function AuditLogPage() {
  const [log, setLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch('/api/audit', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setLog(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load audit log');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">Back to Dashboard</Link>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {log.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No audit log entries yet.</td>
              </tr>
            )}
            {log.map((entry: AuditEntry, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.listingId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.admin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}