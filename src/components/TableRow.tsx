import React from "react";
import Link from "next/link";

interface TableRowProps {
  listing: any;
  className?: string;
}

function TableRowComponent({ listing, className = "" }: TableRowProps) {
  return (
    <tr className={`hover:bg-blue-50 transition-colors ${className}`}>
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
        <form method="POST" action={`/api/listings/${listing.id}/approve`} className="inline">
          <button 
            type="submit" 
            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Approve
          </button>
        </form>
        <form method="POST" action={`/api/listings/${listing.id}/reject`} className="inline">
          <button 
            type="submit" 
            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Reject
          </button>
        </form>
        <Link 
          href={`/dashboard/edit/${listing.id}`}
          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}

const TableRow = React.memo(TableRowComponent, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.listing) === JSON.stringify(nextProps.listing) && prevProps.className === nextProps.className;
});

export default TableRow; 