import type { NextFunction, Request, Response } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const headerToken = req.header('x-admin-token');
  const expected = process.env.ADMIN_API_TOKEN;

  if (!expected) {
    return next();
  }

  if (!headerToken || headerToken !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}
