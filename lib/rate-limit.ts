import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// 5 checkout attempts per minute per IP
export const checkoutLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  prefix: 'rl:checkout',
})

// 30 play increments per minute per IP
export const playsLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  prefix: 'rl:plays',
})