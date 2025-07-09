import { NextApiRequest, NextApiResponse } from 'next';
import { auditLog } from './listings';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-token') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.status(200).json(auditLog);
} 