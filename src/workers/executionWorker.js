import { Worker } from "bullmq";
import connection from "../queues/redis.js";
import db from "../configs/db.js";

const executionWorker = new Worker(
    "code-execution",
    async (job) => {
        const { execution_id, session_id, language, source_code } = job.data;

        console.log({ execution_id, session_id, language, source_code });
    },
    { connection }
);