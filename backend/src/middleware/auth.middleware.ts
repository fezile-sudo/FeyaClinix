import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: 'Authentication token is required'
    });

    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({
      message: 'Invalid authentication format'
    });

    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not configured');

    res.status(500).json({
      message: 'Authentication configuration error'
    });

    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.userId !== 'number' ||
      typeof decoded.role !== 'string'
    ) {
      res.status(401).json({
        message: 'Invalid authentication token'
      });

      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();

  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired authentication token'
    });
  }
}
