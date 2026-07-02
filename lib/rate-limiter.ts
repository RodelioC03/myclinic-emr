// Simple in-memory rate limiter for production
const requests: Map<string, number[]> = new Map()

export function rateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!requests.has(key)) {
    requests.set(key, [now])
    return true
  }

  const timestamps = requests.get(key)!
  const validTimestamps = timestamps.filter((t) => t > windowStart)

  if (validTimestamps.length >= limit) {
    return false
  }

  validTimestamps.push(now)
  requests.set(key, validTimestamps)
  return true
}

export function createRateLimitMiddleware(
  limit: number = 100,
  windowMs: number = 60000
) {
  return (key: string) => rateLimit(key, limit, windowMs)
}
