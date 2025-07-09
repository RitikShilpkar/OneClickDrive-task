import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMessages } from "../../../src/context/MessageContext";

// Listing type for type safety
interface Listing {
  id: number;
  title: string;
  status: string;
  price: number;
  location: string;
  owner: string;
}

export default function EditListingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const { addMessage } = useMessages();

  useEffect(() => {
    if (id) {
      fetch(`/api/listings?limit=100`)
        .then(res => res.json())
        .then(data => {
          const found: Listing | undefined = data.listings.find((l: Listing) => l.id === Number(id));
          setListing(found || null);
          setTitle(found?.title || "");
          setPrice(found?.price || 0);
          setLocation(found?.location || "");
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, location }),
      });
      addMessage('success', 'Listing updated successfully!');
      router.push("/dashboard");
    } catch {
      addMessage('error', 'Failed to update listing');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  );
  
  if (!listing) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-red-600">Listing not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
          <p className="mt-2 text-sm text-gray-600">Update the listing information below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 