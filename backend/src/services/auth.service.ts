import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

interface LoginResult {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResult | null> {

  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      password_hash,
      role
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    secret,
    {
      expiresIn: '8h'
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
}
