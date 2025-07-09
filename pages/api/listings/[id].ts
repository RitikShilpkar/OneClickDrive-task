import { NextApiRequest, NextApiResponse } from 'next';
import { listings, auditLog } from './index';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const listingId = Number(id);
  
  if (req.method === 'PUT') {
    const idx = listings.findIndex((l: any) => l.id === listingId);
    if (idx === -1) {
      return res.status(404).json({ error: "Not found" });
    }
    
    const data = req.body;
    listings[idx] = { ...listings[idx], ...data };
    
    auditLog.push({
      action: "edit",
      listingId: listingId,
      admin: "admin1",
      timestamp: new Date().toISOString(),
    });
    
    return res.status(200).json(listings[idx]);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
} 