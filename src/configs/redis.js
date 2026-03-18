import IORedis from "ioredis";

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;

const connection = new IORedis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null
});

export default connection;