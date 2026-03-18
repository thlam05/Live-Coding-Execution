import { Queue } from "bullmq";
import connection from "../configs/redis.js";

const executionQueue = new Queue("code-execution", {
    connection
});

export default executionQueue;