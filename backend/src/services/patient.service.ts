import { pool } from '../config/database.js';

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string;
  medicalConditions?: string;
  insuranceProvider?: string;
  status?: 'Active' | 'Inactive';
}

export type UpdatePatientData = Partial<CreatePatientData>;

const patientSelect = `
  SELECT
    id,
    first_name AS "firstName",
    last_name AS "lastName",
    date_of_birth AS "dateOfBirth",
    gender,
    phone,
    email,
    address,
    blood_group AS "bloodGroup",
    emergency_contact AS "emergencyContact",
    emergency_phone AS "emergencyPhone",
    allergies,
    medical_conditions AS "medicalConditions",
    insurance_provider AS "insuranceProvider",
    status,
    created_at AS "createdAt"
  FROM patients
`;

export async function createPatient(data: CreatePatientData) {
  const result = await pool.query(
    `
    INSERT INTO patients (
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      blood_group,
      emergency_contact,
      emergency_phone,
      allergies,
      medical_conditions,
      insurance_provider,
      status
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14
    )
    RETURNING id
    `,
    [
      data.firstName,
      data.lastName,
      data.dateOfBirth,
      data.gender,
      data.phone,
      data.email,
      data.address,
      data.bloodGroup ?? null,
      data.emergencyContact ?? null,
      data.emergencyPhone ?? null,
      data.allergies ?? null,
      data.medicalConditions ?? null,
      data.insuranceProvider ?? null,
      data.status ?? 'Active'
    ]
  );

  return getPatientById(result.rows[0].id);
}

export async function getPatients() {
  const result = await pool.query(`
    ${patientSelect}
    ORDER BY id DESC
  `);

  return result.rows;
}

export async function getPatientById(id: number) {
  const result = await pool.query(
    `
    ${patientSelect}
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function updatePatient(
  id: number,
  data: UpdatePatientData
) {
  const existing = await getPatientById(id);

  if (!existing) {
    return null;
  }

  const updated = {
    firstName: data.firstName ?? existing.firstName,
    lastName: data.lastName ?? existing.lastName,
    dateOfBirth: data.dateOfBirth ?? existing.dateOfBirth,
    gender: data.gender ?? existing.gender,
    phone: data.phone ?? existing.phone,
    email: data.email ?? existing.email,
    address: data.address ?? existing.address,
    bloodGroup: data.bloodGroup ?? existing.bloodGroup,
    emergencyContact: data.emergencyContact ?? existing.emergencyContact,
    emergencyPhone: data.emergencyPhone ?? existing.emergencyPhone,
    allergies: data.allergies ?? existing.allergies,
    medicalConditions: data.medicalConditions ?? existing.medicalConditions,
    insuranceProvider: data.insuranceProvider ?? existing.insuranceProvider,
    status: data.status ?? existing.status
  };

  await pool.query(
    `
    UPDATE patients
    SET
      first_name = $1,
      last_name = $2,
      date_of_birth = $3,
      gender = $4,
      phone = $5,
      email = $6,
      address = $7,
      blood_group = $8,
      emergency_contact = $9,
      emergency_phone = $10,
      allergies = $11,
      medical_conditions = $12,
      insurance_provider = $13,
      status = $14
    WHERE id = $15
    `,
    [
      updated.firstName,
      updated.lastName,
      updated.dateOfBirth,
      updated.gender,
      updated.phone,
      updated.email,
      updated.address,
      updated.bloodGroup,
      updated.emergencyContact,
      updated.emergencyPhone,
      updated.allergies,
      updated.medicalConditions,
      updated.insuranceProvider,
      updated.status,
      id
    ]
  );

  return getPatientById(id);
}

export async function deletePatient(id: number) {
  const result = await pool.query(
    `
    DELETE FROM patients
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows[0] ?? null;
}
