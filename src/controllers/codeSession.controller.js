import db from "../configs/db.js"
import templateCode from "../utils/templateCode.js";
import * as codeSessionModel from "../models/codeSession.model.js";
import * as executionModel from "../models/execution.model.js";

class CodeSessionController {
    // [POST] - /code-sessions
    async createLiveCodingSession(req, res) {
        try {
            const { language } = req.body;

            let source_code = "";

            if (language == "python") source_code = templateCode.python;
            else if (language == "javascript") source_code = templateCode.javascript;
            else if (language == "cpp") source_code = templateCode.cpp;

            const [session] = await codeSessionModel.createLiveCodingSession({
                language,
                source_code,
                status: "ACTIVE"
            });

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

            res.json({
                execution_id: execution.id,
                status: execution.status
            })
        } catch (err) {
            res.json({
                error: err.message
            })
        }
    }
}

export default new CodeSessionController();