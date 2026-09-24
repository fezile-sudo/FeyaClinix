import { pool } from '../config/database.js';
export interface CreateAppointmentData {
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  reason?: string;
  notes?: string;
}

export type UpdateAppointmentData = Partial<CreateAppointmentData>;

const appointmentSelect = `
  SELECT
    id,
    patient_id AS "patientId",
    doctor_id AS "doctorId",
    appointment_date AS "date",
    appointment_time AS "time",
    status,
    reason,
    notes
  FROM appointments
`;

export async function createAppointment(
  data: CreateAppointmentData
) {
  const result = await pool.query(
    `
    INSERT INTO appointments (
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      status,
      reason,
      notes
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING id
    `,
    [
      data.patientId,
      data.doctorId,
      data.date,
      data.time,
      data.status ?? 'Pending',
      data.reason ?? null,
      data.notes ?? null
    ]
  );

  return getAppointmentById(result.rows[0].id);
}

export async function getAppointments() {
  const result = await pool.query(`
    ${appointmentSelect}
    ORDER BY appointment_date DESC, appointment_time DESC
  `);

  return result.rows;
}

export async function getAppointmentById(id: number) {
  const result = await pool.query(
    `
    ${appointmentSelect}
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function updateAppointment(
  id: number,
  data: UpdateAppointmentData
) {
  const existing = await getAppointmentById(id);

  if (!existing) {
    return null;
  }

  const updated = {
    patientId: data.patientId ?? existing.patientId,
    doctorId: data.doctorId ?? existing.doctorId,
    date: data.date ?? existing.date,
    time: data.time ?? existing.time,
    status: data.status ?? existing.status,
    reason: data.reason ?? existing.reason,
    notes: data.notes ?? existing.notes
  };

  await pool.query(
    `
    UPDATE appointments
    SET
      patient_id = $1,
      doctor_id = $2,
      appointment_date = $3,
      appointment_time = $4,
      status = $5,
      reason = $6,
      notes = $7
    WHERE id = $8
    `,
    [
      updated.patientId,
      updated.doctorId,
      updated.date,
      updated.time,
      updated.status,
      updated.reason,
      updated.notes,
      id
    ]
  );

  return getAppointmentById(id);
}

export async function deleteAppointment(id: number) {
  const result = await pool.query(
    `
    DELETE FROM appointments
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function isDoctorAvailable(
  doctorId: number,
  date: string,
  time: string,
  ignoreAppointmentId?: number
): Promise<boolean> {

  const result = await pool.query(
    `
    SELECT 1
    FROM appointments
    WHERE doctor_id = $1
      AND appointment_date = $2
      AND appointment_time = $3
      AND ($4::integer IS NULL OR id <> $4)
    LIMIT 1
    `,
    [
      doctorId,
      date,
      time,
      ignoreAppointmentId ?? null
    ]
  );

  return result.rows.length === 0;
}
