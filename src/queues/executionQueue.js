import { Queue } from "bullmq";
import connection from "./redis.js";

const executionQueue = new Queue("code-execution", {
    connection
});

export default executionQueue;