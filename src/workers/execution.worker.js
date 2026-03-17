import { Worker } from "bullmq";
import connection from "../queues/redis.js";
import * as executionModel from "../models/execution.model.js";
import { runCode } from "../services/codeRunner.service.js";
import timeTracker from "../utils/timeTracker.util.js";

const executionWorker = new Worker(
    "code-execution",
    async (job) => {
        const { execution_id, session_id, language, source_code } = job.data;

        await executionModel.updateExecution({ execution_id, status: "RUNNING", started_at: new Date() });

        console.log(`LOG: [WORKER]\t[RUNNING]\t[${execution_id}]`);
        console.log(`LOG TIME: [WORKER]\t[QUEUED->RUNNING]\t[${timeTracker.duration.toFixed(0)} ms]`)
        timeTracker.reset();

        const { stdout, stderr } = await runCode({ language, source_code, execution_id });

        const status = stderr ? "FAILED" : "COMPLETED";

        console.log(`LOG: [WORKER]\t[${status}]\t[${execution_id}]`);
        console.log(`LOG TIME: [WORKER]\t[RUNNING->${status}]\t[${timeTracker.duration.toFixed(0)} ms]`)
        timeTracker.stop();

        await executionModel.updateExecution({
            execution_id,
            status: status,
            stdout: stdout,
            stderr: stderr,
            execution_time_ms: timeTracker.duration.toFixed(0),
            finished_at: new Date()
        });
    },
    { connection }
);