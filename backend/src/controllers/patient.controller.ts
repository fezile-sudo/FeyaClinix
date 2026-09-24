import { Request, Response } from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  CreatePatientData,
  UpdatePatientData
} from '../services/patient.service.js';

export async function createPatientController(
  req: Request,
  res: Response
): Promise<void> {

  try {
    const patient = await createPatient(req.body as CreatePatientData);

    res.status(201).json(patient);

  } catch (error) {

    console.error('Failed to create patient:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function getPatientsController(
  _req: Request,
  res: Response
): Promise<void> {

  try {
    const patients = await getPatients();

    res.json(patients);

  } catch (error) {

    console.error('Failed to retrieve patients:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function getPatientByIdController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid patient ID'
    });

    return;
  }

  try {
    const patient = await getPatientById(id);

    if (!patient) {
      res.status(404).json({
        message: 'Patient not found'
      });

      return;
    }

    res.json(patient);

  } catch (error) {

    console.error('Failed to retrieve patient:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function updatePatientController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid patient ID'
    });

    return;
  }

  try {
    const patient = await updatePatient(id, req.body as UpdatePatientData);

    if (!patient) {
      res.status(404).json({
        message: 'Patient not found'
      });

      return;
    }

    res.json(patient);

  } catch (error) {

    console.error('Failed to update patient:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function deletePatientController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid patient ID'
    });

    return;
  }

  try {
    const patient = await deletePatient(id);

    if (!patient) {
      res.status(404).json({
        message: 'Patient not found'
      });

      return;
    }

    res.json({
      message: 'Patient deleted successfully'
    });

  } catch (error: any) {

    console.error('Failed to delete patient:', error);

    if (error.code === '23503') {
      res.status(409).json({
        message: 'Cannot delete patient because they have appointments'
      });

      return;
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}
