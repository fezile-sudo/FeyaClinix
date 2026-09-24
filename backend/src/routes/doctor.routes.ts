import { Router } from 'express';
import {
  createDoctorController,
  getDoctorsController,
  getDoctorByIdController,
  updateDoctorController,
  deleteDoctorController
} from '../controllers/doctor.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createDoctorController);

router.get('/', getDoctorsController);

router.get('/:id', getDoctorByIdController);

router.put('/:id', updateDoctorController);

router.delete('/:id', deleteDoctorController);

export default router;
