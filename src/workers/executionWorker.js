import { Worker } from "bullmq";
import connection from "../queues/redis.js";
import * as executionModel from "../models/execution.model.js";

const executionWorker = new Worker(
    "code-execution",
    async (job) => {
        const { execution_id, session_id, language, source_code } = job.data;

        await executionModel.updateExecution({ execution_id, status: "RUNNING", started_at: new Date() });
        console.log("RUNNING");

        await executionModel.updateExecution({
            execution_id,
            status: "COMPLETED",
            stdout: "Hello world",
            stderr: "",
            execution_time_ms: 120,
            finished_at: new Date()
        });
        console.log("COMPLETED");
    },
    { connection }
);