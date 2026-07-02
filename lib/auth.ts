import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'

// Get the correct base URL - prioritize Vercel production URL, fall back to dev URL
const getBaseUrl = () => {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.V0_RUNTIME_URL) {
    return process.env.V0_RUNTIME_URL
  }
  return 'http://localhost:3001'
}

const baseUrl = getBaseUrl()

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: baseUrl,
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    baseUrl,
    'http://localhost:3001',
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    `https://${process.env.VERCEL_URL}`,
    process.env.V0_RUNTIME_URL,
  ].filter(Boolean),
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'development',
    },
  },
})
