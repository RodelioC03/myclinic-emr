import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export function validateEnv() {
  const result = EnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!result.success) {
    console.error('Environment validation failed:')
    console.error(result.error.errors)
    throw new Error('Invalid environment variables')
  }

  return result.data
}
