import { Request, Response } from 'express';
import { login } from '../services/auth.service.js';
import { pool } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function loginController(
  req: Request,
  res: Response
): Promise<void> {

  const { email, password } = req.body;

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email ||
    !password
  ) {
    res.status(400).json({
      message: 'Email and password are required'
    });

    return;
  }

  try {
    const result = await login(email, password);

    if (!result) {
      res.status(401).json({
        message: 'Invalid email or password'
      });

      return;
    }

    res.json(result);

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function meController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {

  if (!req.user) {
    res.status(401).json({
      message: 'Authentication required'
    });

    return;
  }

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = $1
      `,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        message: 'User no longer exists'
      });

      return;
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Failed to retrieve current user:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

