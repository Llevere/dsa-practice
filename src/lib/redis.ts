import Redis from "ioredis";

/* eslint-disable no-var */
declare global {
  var redis: Redis | undefined;
}
/* eslint-enable no-var */

const redis = global.redis ?? new Redis(process.env.REDIS_URL!);

if (process.env.NODE_ENV !== "production" && !global.redis) {
  console.log("Assigning redis");
  global.redis = redis;
}
export default redis;
