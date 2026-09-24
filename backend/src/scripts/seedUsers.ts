import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';

const users = [
  {
    name: 'Dr. Fezile Gulwa',
    email: 'admin@feyaclinix.com',
    password: 'Admin@123',
    role: 'Administrator'
  },
  {
    name: 'Dr. Sikhangele Gulwa',
    email: 'doctor@feyaclinix.com',
    password: 'Doctor@123',
    role: 'Doctor'
  },
  {
    name: 'Aphiwe Gulwa',
    email: 'reception@feyaclinix.com',
    password: 'Reception@123',
    role: 'Receptionist'
  }
];

async function seedUsers(): Promise<void> {
  try {
    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 12);

      await pool.query(
        `
        INSERT INTO users (
          name,
          email,
          password_hash,
          role
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
        `,
        [
          user.name,
          user.email,
          passwordHash,
          user.role
        ]
      );

      console.log(`Seeded user: ${user.email}`);
    }

    console.log('User seeding complete.');
  } catch (error) {
    console.error('Failed to seed users:', error);
  } finally {
    await pool.end();
  }
}

seedUsers();
