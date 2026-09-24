import express from 'express';
import cors from 'cors';
import { pool } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import patientRoutes from './routes/patient.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';



const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);



app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'FeyaClinix API is running'
  });
});

app.get('/api/health/db', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      database: 'connected',
      time: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection failed:', error);

    res.status(500).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

app.listen(PORT, () => {
  console.log(`FeyaClinix API running on port ${PORT}`);
});

