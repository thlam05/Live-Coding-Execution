import * as executionModel from "../models/execution.model.js"

class ExecutionController {
    // [GET] - /executions/{execution_id}
    async getExecutionResult(req, res) {
        try {
            const { execution_id } = req.params;

            const [execution] = await executionModel.getExecution({ execution_id });

            res.json(execution);
        } catch (err) {
            res.json({
                error: err.message
            })
        }
    }
}

export default new ExecutionController();