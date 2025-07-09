import React, { useState } from "react";
import Link from "next/link";
import { useMessages } from "../context/MessageContext";

interface Listing {
  id: number;
  title: string;
  status: string;
  price: number;
  location: string;
  owner: string;
}

interface TableRowProps {
  listing: Listing;
  className?: string;
  onStatusChange?: () => void;
  loadingRowId?: number | null;
  setLoadingRowId?: (id: number | null) => void;
}

function TableRowComponent({ listing, className = "", onStatusChange, loadingRowId, setLoadingRowId }: TableRowProps) {
  const { addMessage } = useMessages();
  const isLoading = loadingRowId === listing.id;

  const handleAction = async (action: "approve" | "reject") => {
    if (setLoadingRowId) setLoadingRowId(listing.id);
    try {
      await fetch(`/api/listings/${listing.id}/${action}`, { method: "POST" });
      addMessage("success", `Listing ${action}d!`);
      if (onStatusChange) onStatusChange();
    } catch {
      addMessage("error", `Failed to ${action} listing`);
    } finally {
      if (setLoadingRowId) setLoadingRowId(null);
    }
  };

  return (
    <tr className={`relative hover:bg-blue-50 transition-colors ${className}`}>
      {isLoading && (
        <td colSpan={6} className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <span className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></span>
        </td>
      )}
      {!isLoading && <>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{listing.title}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.owner}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.location}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${listing.price}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            listing.status === 'approved' ? 'bg-green-100 text-green-800' :
            listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {listing.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button
            type="button"
            onClick={() => handleAction("approve")}
            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => handleAction("reject")}
            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Reject
          </button>
          <Link
            href={`/dashboard/edit/${listing.id}`}
            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Edit
          </Link>
        </td>
      </>}
    </tr>
  );
}

const TableRow = React.memo(TableRowComponent, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.listing) === JSON.stringify(nextProps.listing) && prevProps.className === nextProps.className && prevProps.loadingRowId === nextProps.loadingRowId;
});

export default TableRow; 