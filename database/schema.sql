CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL,
    doctor_id INTEGER UNIQUE,
    
    CONSTRAINT users_role_check
        CHECK (role IN ('Administrator', 'Doctor', 'Receptionist'))
);

CREATE TABLE doctors (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    specialty VARCHAR(150) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    years_of_experience INTEGER NOT NULL,
    consultation_fee NUMERIC(10, 2) NOT NULL,
    department VARCHAR(150) NOT NULL,
    availability VARCHAR(20) NOT NULL DEFAULT 'Available',
    status VARCHAR(20) NOT NULL DEFAULT 'Active',

    CONSTRAINT doctors_gender_check
        CHECK (gender IN ('Male', 'Female', 'Other')),

    CONSTRAINT doctors_availability_check
        CHECK (availability IN ('Available', 'Busy', 'On Leave')),

    CONSTRAINT doctors_status_check
        CHECK (status IN ('Active', 'Inactive')),

    CONSTRAINT doctors_experience_check
        CHECK (years_of_experience >= 0),

    CONSTRAINT doctors_fee_check
        CHECK (consultation_fee >= 0)
);

CREATE TABLE patients (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(150),
    emergency_phone VARCHAR(30),
    allergies TEXT,
    medical_conditions TEXT,
    insurance_provider VARCHAR(150),
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT patients_gender_check
        CHECK (gender IN ('Male', 'Female', 'Other')),

    CONSTRAINT patients_status_check
        CHECK (status IN ('Active', 'Inactive'))
);

CREATE TABLE appointments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    reason TEXT,
    notes TEXT,

    CONSTRAINT appointments_status_check
        CHECK (status IN (
            'Pending',
            'Confirmed',
            'Completed',
            'Cancelled'
        )),

    CONSTRAINT appointments_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE RESTRICT,

    CONSTRAINT appointments_doctor_fk
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE RESTRICT,

    CONSTRAINT appointments_doctor_schedule_unique
        UNIQUE (doctor_id, appointment_date, appointment_time)
);


ALTER TABLE users
ADD CONSTRAINT users_doctor_fk
FOREIGN KEY (doctor_id)
REFERENCES doctors(id)
ON DELETE SET NULL;
