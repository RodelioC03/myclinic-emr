import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limiter'

/**
 * Apply rate limiting to an endpoint
 * @param request NextRequest
 * @param identifier Unique identifier (IP, user ID, email, etc.)
 * @param limit Max requests per window (default: 100)
 * @param windowMs Time window in ms (default: 60s)
 */
export function checkRateLimit(
  request: NextRequest,
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): NextResponse | null {
  if (!rateLimit(identifier, limit, windowMs)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': Math.ceil(windowMs / 1000).toString() } }
    )
  }
  return null
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  )
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
