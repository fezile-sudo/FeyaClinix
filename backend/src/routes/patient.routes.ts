import { Router } from 'express';

import {
  createPatientController,
  getPatientsController,
  getPatientByIdController,
  updatePatientController,
  deletePatientController
} from '../controllers/patient.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createPatientController);

router.get('/', getPatientsController);

router.get('/:id', getPatientByIdController);

router.put('/:id', updatePatientController);

router.delete('/:id', deletePatientController);

export default router;
