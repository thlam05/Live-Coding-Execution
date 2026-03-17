import { generateTemplateCode } from "../utils/codeGenerator.util.js";
import * as codeSessionModel from "../models/codeSession.model.js";
import * as executionModel from "../models/execution.model.js";
import executionQueue from "../queues/execution.queue.js";

class CodeSessionController {
    // [POST] - /code-sessions
    async createLiveCodingSession(req, res) {
        try {
            const { language } = req.body;

            let source_code = generateTemplateCode(language);

            const [session] = await codeSessionModel.createLiveCodingSession({
                language,
                source_code,
                status: "ACTIVE"
            });

            console.log(`LOG: [SERVER]\t[CREATE CODE SESSION]`);

            res.json({
                session_id: session.id,
                status: session.status
            })
        } catch (err) {
            res.json({
                error: err.message
            });
        }
    }

    // [PATCH] - /code-sessions/{session_id}
    async saveLiveCodingSession(req, res) {
        try {
            const { session_id } = req.params;
            const { language, source_code } = req.body;

            const [session] = await codeSessionModel.saveCodeSession({
                session_id,
                language,
                source_code
            })
            console.log(`LOG: [SERVER]\t[SAVE CODE SESSION]`);

            res.json({
                session_id: session.id,
                status: session.status
            })
        } catch (err) {
            res.json({
                error: err.message
            });
        }
    }

    // [POST] /code-sessions/{session_id}/run
    async executeCurrentCode(req, res) {
        try {
            const { session_id } = req.params;

            const [session] = await codeSessionModel.findCodeSession({ session_id });

            if (!session) {
                throw new Error("session not found");
            }

            const [execution] = await executionModel.createExecution({ session_id: session.id });

            await executionQueue.add("run-code", {
                execution_id: execution.id,
                session_id,
                language: session.language,
                source_code: session.source_code
            })
            console.log(`LOG: [SERVER]\t[QUEUED]\t[${execution.id}]`)

            res.json({
                execution_id: execution.id,
                status: "QUEUED",
                queued_at: new Date()
            })
        } catch (err) {
            res.json({
                error: err.message
            })
        }
    }
}

export default new CodeSessionController();