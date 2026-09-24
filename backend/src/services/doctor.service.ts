import { pool } from '../config/database.js';

export interface CreateDoctorData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  specialty: string;
  qualification: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  department: string;
  availability?: 'Available' | 'Busy' | 'On Leave';
  status?: 'Active' | 'Inactive';
}

export type UpdateDoctorData = Partial<CreateDoctorData>;

const doctorSelect = `
  SELECT
    id,
    first_name AS "firstName",
    last_name AS "lastName",
    date_of_birth AS "dateOfBirth",
    gender,
    phone,
    email,
    address,
    specialty,
    qualification,
    license_number AS "licenseNumber",
    years_of_experience AS "yearsOfExperience",
    consultation_fee AS "consultationFee",
    department,
    availability,
    status
  FROM doctors
`;

export async function createDoctor(
  data: CreateDoctorData
) {
  const result = await pool.query(
    `
    INSERT INTO doctors (
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      specialty,
      qualification,
      license_number,
      years_of_experience,
      consultation_fee,
      department,
      availability,
      status
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15
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
        data.specialty,
        data.qualification,
        data.licenseNumber,
        data.yearsOfExperience,
        data.consultationFee,
        data.department,
        data.availability ?? 'Available',
        data.status ?? 'Active'
    ]

  );

  return getDoctorById(result.rows[0].id);
}

export async function getDoctors() {
  const result = await pool.query(
    `
    ${doctorSelect}
    ORDER BY id DESC
    `
  );

  return result.rows;
}

export async function getDoctorById(id: number) {
  const result = await pool.query(
    `
    ${doctorSelect}
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function updateDoctor(
  id: number,
  data: UpdateDoctorData
) {
  const existingDoctor = await getDoctorById(id);

  if (!existingDoctor) {
    return null;
  }

  const updated = {
    firstName: data.firstName ?? existingDoctor.firstName,
    lastName: data.lastName ?? existingDoctor.lastName,
    dateOfBirth: data.dateOfBirth ?? existingDoctor.dateOfBirth,
    gender: data.gender ?? existingDoctor.gender,
    phone: data.phone ?? existingDoctor.phone,
    email: data.email ?? existingDoctor.email,
    address: data.address ?? existingDoctor.address,
    specialty: data.specialty ?? existingDoctor.specialty,
    qualification: data.qualification ?? existingDoctor.qualification,
    licenseNumber: data.licenseNumber ?? existingDoctor.licenseNumber,
    yearsOfExperience:
      data.yearsOfExperience ?? existingDoctor.yearsOfExperience,
    consultationFee:
      data.consultationFee ?? existingDoctor.consultationFee,
    department: data.department ?? existingDoctor.department,
    availability:
      data.availability ?? existingDoctor.availability,
    status: data.status ?? existingDoctor.status
  };

  await pool.query(
    `
    UPDATE doctors
    SET
      first_name = $1,
      last_name = $2,
      date_of_birth = $3,
      gender = $4,
      phone = $5,
      email = $6,
      address = $7,
      specialty = $8,
      qualification = $9,
      license_number = $10,
      years_of_experience = $11,
      consultation_fee = $12,
      department = $13,
      availability = $14,
      status = $15
    WHERE id = $16
    `,
    [
      updated.firstName,
      updated.lastName,
      updated.dateOfBirth,
      updated.gender,
      updated.phone,
      updated.email,
      updated.address,
      updated.specialty,
      updated.qualification,
      updated.licenseNumber,
      updated.yearsOfExperience,
      updated.consultationFee,
      updated.department,
      updated.availability,
      updated.status,
      id
    ]
  );

  return getDoctorById(id);
}

export async function deleteDoctor(id: number) {
  const result = await pool.query(
    `
    DELETE FROM doctors
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

