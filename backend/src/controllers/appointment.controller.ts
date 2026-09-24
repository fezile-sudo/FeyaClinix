import { Request, Response } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  isDoctorAvailable,
  CreateAppointmentData,
  UpdateAppointmentData
} from '../services/appointment.service.js';


export async function createAppointmentController(
  req: Request,
  res: Response
): Promise<void> {

  try {
    const appointment = await createAppointment(req.body as CreateAppointmentData);

    res.status(201).json(appointment);

  } catch (error: any) {

    console.error('Failed to create appointment:', error);

    if (error.code === '23503') {
      res.status(400).json({
        message:
          'The specified patient or doctor does not exist'
      });

      return;
    }

    if (error.code === '23505') {
      res.status(409).json({
        message:
          'The doctor already has an appointment at this date and time'
      });

      return;
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function getAppointmentsController(
  _req: Request,
  res: Response
): Promise<void> {

  try {
    const appointments = await getAppointments();

    res.json(appointments);

  } catch (error) {

    console.error('Failed to retrieve appointments:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function getAppointmentByIdController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid appointment ID'
    });

    return;
  }

  try {
    const appointment = await getAppointmentById(id);

    if (!appointment) {
      res.status(404).json({
        message: 'Appointment not found'
      });

      return;
    }

    res.json(appointment);

  } catch (error) {

    console.error('Failed to retrieve appointment:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function updateAppointmentController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid appointment ID'
    });

    return;
  }

  try {
    const appointment = await updateAppointment(id, req.body as UpdateAppointmentData);

    if (!appointment) {
      res.status(404).json({
        message: 'Appointment not found'
      });

      return;
    }

    res.json(appointment);

  } catch (error: any) {

    console.error('Failed to update appointment:', error);

    if (error.code === '23503') {
      res.status(400).json({
        message: 'The specified patient or doctor does not exist'
      });

      return;
    }

    if (error.code === '23505') {
      res.status(409).json({
        message: 'The doctor already has an appointment at this date and time'
      });

      return;
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function deleteAppointmentController(
  req: Request,
  res: Response
): Promise<void> {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({
      message: 'Invalid appointment ID'
    });

    return;
  }

  try {
    const appointment = await deleteAppointment(id);

    if (!appointment) {
      res.status(404).json({
        message: 'Appointment not found'
      });

      return;
    }

    res.json({
      message: 'Appointment deleted successfully'
    });

  } catch (error) {

    console.error('Failed to delete appointment:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function isDoctorAvailableController(
  req: Request,
  res: Response
): Promise<void> {

  const doctorId = Number(req.query.doctorId);
  const date = String(req.query.date ?? '');
  const time = String(req.query.time ?? '');

  const ignoreAppointmentId =
    req.query.ignoreAppointmentId
      ? Number(req.query.ignoreAppointmentId)
      : undefined;

  if (
    !Number.isInteger(doctorId) ||
    !date ||
    !time ||
    (
      ignoreAppointmentId !== undefined && !Number.isInteger(ignoreAppointmentId)
    )
  ) {
    res.status(400).json({
      message: 'Invalid availability request'
    });

    return;
  }

  try {

    const available = await isDoctorAvailable(doctorId, date, time, ignoreAppointmentId);

    res.json({
      available
    });

  } catch (error) {

    console.error('Failed to check doctor availability:', error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

