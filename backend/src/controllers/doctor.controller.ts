import { Request, Response } from 'express';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  CreateDoctorData,
  UpdateDoctorData
} from '../services/doctor.service.js';

export async function createDoctorController(
  req: Request,
  res: Response
): Promise<void> {

  try {
    const doctor = await createDoctor(req.body as CreateDoctorData);

    res.status(201).json(doctor);

  } catch (error: any) {

    console.error('Failed to create doctor:', error);

    if (error.code === '23505') {
      res.status(409).json({
        message: 'A doctor with this email or license number already exists'
      });

      return;
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function getDoctorsController(
  _req: Request,
  res: Response
): Promise<void> {

  try {
    const doctors = await getDoctors();

    res.json(doctors);

  } catch (error) {

    console.error('Failed to retrieve doctors:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function getDoctorByIdController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid doctor ID'
    });

    return;
  }

  try {
    const doctor = await getDoctorById(id);

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found'
      });

      return;
    }

    res.json(doctor);

  } catch (error) {

    console.error('Failed to retrieve doctor:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function updateDoctorController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid doctor ID'
    });

    return;
  }

  try {
    const doctor = await updateDoctor(id, req.body as UpdateDoctorData);

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found'
      });

      return;
    }

    res.json(doctor);

  } catch (error: any) {

    console.error('Failed to update doctor:', error);

    if (error.code === '23505') {
      res.status(409).json({
        message: 'A doctor with this email or license number already exists'
      });

      return;
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function deleteDoctorController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid doctor ID'
    });

    return;
  }

  try {
    const doctor = await deleteDoctor(id);

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found'
      });

      return;
    }

    res.json({
      message: 'Doctor deleted successfully'
    });

  } catch (error) {

    console.error('Failed to delete doctor:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

