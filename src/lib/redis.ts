import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isRedisConfigured = redisUrl && redisToken && !redisUrl.includes("your_upstash");

export const redis = isRedisConfigured
  ? new Redis({ url: redisUrl!, token: redisToken! })
  : null;

export async function redisRateLimit(
  ip: string,
  limit: number = 5,
  window: number = 60
): Promise<{ success: boolean; limit: number; remaining: number }> {
  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      console.error("Redis not configured - rate limiting disabled in production!");
    }
    return { success: true, limit, remaining: limit };
  }

  const key = `ratelimit:${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  const remaining = Math.max(0, limit - count);

  return {
    success: count <= limit,
    limit,
    remaining,
  };
}

export async function slidingWindowRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60000
): Promise<{ success: boolean; limit: number; remaining: number; resetMs: number }> {
  if (!redis) {
    return { success: true, limit, remaining: limit, resetMs: windowMs };
  }

  const key = `ratelimit:sliding:${ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Remove old entries and add current request
  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, windowStart);
  multi.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  multi.zcard(key);
  multi.expire(key, Math.ceil(windowMs / 1000));

  const results = await multi.exec();
  const currentCount = (results?.[2] as number) || 0;

  return {
    success: currentCount <= limit,
    limit,
    remaining: Math.max(0, limit - currentCount),
    resetMs: windowStart + windowMs - now,
  };
}
