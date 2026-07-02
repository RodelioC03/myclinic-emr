# MyClinic EMR

A simple web-based EMR MVP for a solo clinic. The interface follows the supplied workflow:

1. Simple login
2. Dashboard quick actions
3. Live patient search
4. Patient chart
5. One-page SOAP consult
6. Labs and imaging
7. Prescription shortcuts
8. Medical certificate generation
9. One Save All action

The timeline module is intentionally not included.

## Current Scope

This version is a functioning frontend MVP. It uses sample patients and browser `localStorage` so the Save All button persists data on the same device and browser.

It is not yet a production medical-record system. Before using real patient data, add secure authentication, role-based access, a real database, audit logs, encryption, backups, and privacy/compliance review.

## Stack

- Next/Vinext
- TypeScript
- React
- Tailwind CSS
- Cloudflare Sites-compatible build output

The PDFs recommend Next.js, TypeScript, Tailwind, shadcn/ui, NestJS, Prisma, and PostgreSQL. This first version uses the frontend pieces and keeps the backend/database for the next stage so the MVP stays simple.

## Run Locally

```bash
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:3001/
```

## Validate

```bash
npm.cmd run build
```

## Future Improvements

- Replace demo login with secure authentication
- Add PostgreSQL/Prisma or Cloudflare D1 persistence
- Add roles for doctor, nurse, receptionist, and admin
- Generate printable PDF prescriptions and certificates
- Add audit logs and access history
- Add encrypted file storage for uploaded labs and imaging
- Add the timeline later when requested
