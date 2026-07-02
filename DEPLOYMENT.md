# Clinix EMR - Deployment Guide

## Overview

Clinix EMR is a complete Electronic Medical Records system for solo clinics with full RBAC, appointment management, and patient portal.

## Environment Variables

Set these in your deployment environment:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Authentication (generate with: openssl rand -base64 32)
JWT_SECRET=your-secure-jwt-secret-here

# Environment
NODE_ENV=production
```

## Pre-Deployment Checklist

- [ ] Generate strong JWT_SECRET: `openssl rand -base64 32`
- [ ] Create PostgreSQL database (Neon, Supabase, AWS RDS, etc.)
- [ ] Run migrations: `pnpm prisma db push`
- [ ] Seed test accounts: `pnpm prisma db seed`
- [ ] Verify all environment variables are set
- [ ] Test authentication endpoints locally
- [ ] Review RBAC rules in `/lib/rbac-middleware.ts`

## Deployment Steps

### 1. Vercel Deployment

```bash
# Connect your repo
vercel link

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET

# Deploy
vercel --prod
```

### 2. Manual Deployment

```bash
# Build the app
pnpm build

# Start server
pnpm start
```

## Database Setup

### Neon (Recommended)

1. Create project at https://console.neon.tech
2. Copy connection string to `DATABASE_URL`
3. Run migrations

### Supabase

1. Create project at https://supabase.com
2. Get connection string from Settings > Database
3. Set `DATABASE_URL` and run migrations

### AWS RDS / Aurora

1. Create PostgreSQL database
2. Set security group to allow your deployment IP
3. Use connection string: `postgresql://user:password@host:port/database`

## Test Accounts

After seeding, use these accounts:

- **Admin**: admin@clinix.com / admin123
- **Doctor**: doctor@clinix.com / doctor123
- **Patient**: patient@clinix.com / patient123

## Security Hardening

### Implemented

- ✅ JWT-based authentication with 7-day expiry
- ✅ bcrypt password hashing (10 rounds)
- ✅ RBAC with role checks on every protected endpoint
- ✅ Input validation with Zod on all API endpoints
- ✅ Patient data scoped to authenticated user
- ✅ Rate limiting on auth endpoints
- ✅ XSS protection via input sanitization
- ✅ CORS headers (add to middleware if needed)

### Recommended for Production

- [ ] Add CSRF protection middleware
- [ ] Enable HTTPS/TLS only
- [ ] Set security headers (helmet.js or manual headers)
- [ ] Add audit logging for sensitive actions
- [ ] Implement session timeouts (30-60 minutes idle)
- [ ] Enable request logging and monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Add rate limiting per IP (use Vercel rate limiting)
- [ ] Encrypt sensitive fields in database
- [ ] Regular security audits

## API Endpoints

### Authentication

```
POST /api/auth/register - Register patient
POST /api/auth/login - Login any user
```

### Doctor APIs

```
GET /api/doctor/patients - Search patients
GET /api/doctor/patients/[id] - Get patient chart
POST /api/encounters - Create SOAP note
POST /api/prescriptions - Create prescription
```

### Patient APIs

```
GET /api/appointments - Get appointments
POST /api/appointments - Request appointment
GET /api/notifications - Get notifications
PATCH /api/notifications/[id]/read - Mark as read
```

## Monitoring & Logs

### Vercel

- Check deployment logs: `vercel logs --prod`
- Monitor at https://vercel.com/dashboard

### Database

Monitor connections and performance:
- Neon: https://console.neon.tech (Monitoring tab)
- Supabase: https://app.supabase.com (Logs tab)

## Backup & Recovery

### Database Backup

**Neon**: Automatic daily backups in Neon Dashboard
**Supabase**: Automated backups included

### Manual Backup

```bash
# Dump database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Scaling Considerations

- Use database connection pooling (PgBouncer, Neon's built-in pooling)
- Enable caching headers on static assets
- Consider CDN for files (Vercel Blob, Cloudflare)
- Monitor database performance and indexes
- Scale database separately if needed

## Troubleshooting

### "No authorization token provided"

- Ensure login works and token is stored in localStorage
- Check browser DevTools > Application > Local Storage

### "Session expired"

- Sessions expire after 7 days
- User must login again
- Consider reducing expiry for sensitive environments

### Database connection errors

- Verify DATABASE_URL is correct
- Check database is accepting connections
- Ensure firewall allows connection from deployment IP
- Test locally: `pnpm prisma db push --skip-generate`

## Support

For issues or questions, check:
- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs
- Your database provider's support portal
