import express from "express";
import executionController from "../controllers/execution.controller.js";

const router = express.Router();

router.get("/:execution_id", executionController.getExecutionResult);

export default router;