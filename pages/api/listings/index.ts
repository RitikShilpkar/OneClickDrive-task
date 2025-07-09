import { NextApiRequest, NextApiResponse } from 'next';

let listings = [
  {
    id: 1,
    title: "Toyota Camry",
    status: "pending",
    price: 50,
    location: "New York",
    owner: "user1",
  },
  {
    id: 2,
    title: "Honda Civic",
    status: "pending",
    price: 45,
    location: "Los Angeles",
    owner: "user2",
  },
  {
    id: 3,
    title: "Ford Mustang",
    status: "pending",
    price: 80,
    location: "Chicago",
    owner: "user3",
  },
  {
    id: 4,
    title: "Chevrolet Malibu",
    status: "pending",
    price: 55,
    location: "Houston",
    owner: "user4",
  },
  {
    id: 5,
    title: "Nissan Altima",
    status: "pending",
    price: 60,
    location: "Miami",
    owner: "user5",
  },
  {
    id: 6,
    title: "BMW 3 Series",
    status: "pending",
    price: 100,
    location: "San Francisco",
    owner: "user6",
  },
  {
    id: 7,
    title: "Audi A4",
    status: "pending",
    price: 110,
    location: "Seattle",
    owner: "user7",
  },
  {
    id: 8,
    title: "Hyundai Elantra",
    status: "pending",
    price: 40,
    location: "Boston",
    owner: "user8",
  },
  {
    id: 9,
    title: "Kia Optima",
    status: "pending",
    price: 42,
    location: "Denver",
    owner: "user9",
  },
  {
    id: 10,
    title: "Volkswagen Passat",
    status: "pending",
    price: 48,
    location: "Atlanta",
    owner: "user10",
  },
];

let auditLog: any[] = [];

export { listings, auditLog };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page = 1, limit = 5, status } = req.query;
    let filtered = listings;
    
    if (status && status !== "all") {
      filtered = listings.filter(l => l.status === status);
    }
    
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginated = filtered.slice(start, end);
    
    return res.status(200).json({
      listings: paginated,
      total: filtered.length,
      page: Number(page),
      limit: Number(limit),
    });
  }
  
  if (req.method === 'POST') {
    const data = req.body;
    const newListing = { ...data, id: Date.now(), status: "pending" };
    listings.push(newListing);
    return res.status(201).json(newListing);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
} 