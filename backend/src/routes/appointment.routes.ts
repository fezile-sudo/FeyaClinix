import { Router } from 'express';
import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController,
  isDoctorAvailableController
} from '../controllers/appointment.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createAppointmentController);

router.get('/', getAppointmentsController);

router.get('/availability', isDoctorAvailableController);

router.get('/:id', getAppointmentByIdController);

router.put('/:id', updateAppointmentController);

router.delete('/:id', deleteAppointmentController);

export default router;