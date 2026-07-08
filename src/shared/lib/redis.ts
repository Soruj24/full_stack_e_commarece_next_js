import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = redisUrl && redisToken && !redisUrl.includes("your_upstash")
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

export async function redisRateLimit(ip: string, limit: number = 5, window: number = 60) {
  if (!redis) {
    return {
      success: true,
      limit,
      remaining: limit,
    };
  }
  const key = `ratelimit:${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  return {
    success: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
  };
}
