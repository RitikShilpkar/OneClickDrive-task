import { NextApiRequest, NextApiResponse } from 'next';
import { listings, auditLog } from '../index';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const listingId = Number(id);
  const idx = listings.findIndex((l) => l.id === listingId);

  if (idx !== -1) {
    listings[idx].status = "approved";
    auditLog.push({
      action: "approve",
      listingId: listingId,
      admin: "admin1",
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json(listings[idx]);
  }

  return res.status(404).json({ error: "Not found" });
} 