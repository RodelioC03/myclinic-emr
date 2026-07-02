import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const doctorPassword = await bcrypt.hash('doctor123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinix.com' },
    update: {},
    create: {
      email: 'admin@clinix.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('Created admin:', admin.email)

  // Create doctor user
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@clinix.com' },
    update: {},
    create: {
      email: 'doctor@clinix.com',
      password: doctorPassword,
      name: 'Dr. John Smith',
      role: 'DOCTOR',
      doctorProfile: {
        create: {
          license: 'MD123456',
          specialty: 'General Practice',
          experience: 10,
        },
      },
    },
    include: {
      doctorProfile: true,
    },
  })

  console.log('Created doctor:', doctor.email)

  // Create sample patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@clinix.com' },
    update: {},
    create: {
      email: 'patient@clinix.com',
      password: await bcrypt.hash('patient123', 10),
      name: 'Jane Doe',
      role: 'PATIENT',
      patientProfile: {
        create: {
          dateOfBirth: new Date('1990-01-15'),
          sex: 'F',
          civilStatus: 'Single',
          contact: '555-1234',
          address: '123 Main St',
          occupation: 'Teacher',
          allergies: 'Penicillin',
          weight: 65,
          height: 165,
          bmi: 23.9,
        },
      },
    },
    include: {
      patientProfile: true,
    },
  })

  console.log('Created patient:', patient.email)

  console.log('Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
