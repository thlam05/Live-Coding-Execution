import { Worker } from "bullmq";
import connection from "../queues/redis.js";
import * as executionModel from "../models/execution.model.js";
import { runCode } from "../services/codeRunner.service.js";

const executionWorker = new Worker(
    "code-execution",
    async (job) => {
        const { execution_id, session_id, language, source_code } = job.data;

        await executionModel.updateExecution({ execution_id, status: "RUNNING", started_at: new Date() });
        console.log(`LOG: [WORKER]\t[RUNNING]\t[${execution_id}]`);

        const { stdout, stderr } = await runCode({ language, source_code, execution_id });

        const status = stderr ? "FAILED" : "COMPLETED";

        await executionModel.updateExecution({
            execution_id,
            status: status,
            stdout: stdout,
            stderr: stderr,
            execution_time_ms: 120,
            finished_at: new Date()
        });
        console.log(`LOG: [WORKER]\t[${status}]\t[${execution_id}]`);
    },
    { connection }
);