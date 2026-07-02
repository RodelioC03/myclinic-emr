import { pgTable, text, timestamp, boolean, integer, real, date } from 'drizzle-orm/pg-core'

// --- Better Auth required tables ---
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('patient'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
})

// --- EMR App Tables ---
export const doctorProfile = pgTable('doctor_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  specialization: text('specialization'),
  licenseNumber: text('licenseNumber').unique(),
  yearsOfExperience: integer('yearsOfExperience'),
  bio: text('bio'),
  phone: text('phone'),
  avatar: text('avatar'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const patientProfile = pgTable('patient_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  dateOfBirth: date('dateOfBirth'),
  gender: text('gender'),
  bloodType: text('bloodType'),
  phone: text('phone'),
  address: text('address'),
  allergies: text('allergies'),
  medicalHistory: text('medicalHistory'),
  avatar: text('avatar'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const appointment = pgTable('appointment', {
  id: text('id').primaryKey(),
  doctorId: text('doctorId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  patientId: text('patientId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  appointmentDate: timestamp('appointmentDate').notNull(),
  status: text('status').notNull().default('scheduled'),
  reason: text('reason'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const consultation = pgTable('consultation', {
  id: text('id').primaryKey(),
  appointmentId: text('appointmentId').references(() => appointment.id, { onDelete: 'cascade' }),
  doctorId: text('doctorId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  patientId: text('patientId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  diagnosis: text('diagnosis'),
  symptoms: text('symptoms'),
  treatment: text('treatment'),
  prescription: text('prescription'),
  notes: text('notes'),
  visitType: text('visitType'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const vitals = pgTable('vitals', {
  id: text('id').primaryKey(),
  consultationId: text('consultationId').references(() => consultation.id, { onDelete: 'cascade' }),
  patientId: text('patientId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  temperature: real('temperature'),
  bloodPressureSystolic: integer('bloodPressureSystolic'),
  bloodPressureDiastolic: integer('bloodPressureDiastolic'),
  heartRate: integer('heartRate'),
  respiratoryRate: integer('respiratoryRate'),
  oxygenSaturation: real('oxygenSaturation'),
  weight: real('weight'),
  height: real('height'),
  recordedAt: timestamp('recordedAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const medicalRecord = pgTable('medical_record', {
  id: text('id').primaryKey(),
  patientId: text('patientId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  doctorId: text('doctorId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  recordType: text('recordType').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  fileUrl: text('fileUrl'),
  recordDate: date('recordDate').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
