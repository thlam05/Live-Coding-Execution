import express from "express";
import codeSessionController from "../controllers/codeSession.controller.js";

const router = express.Router();

router.post("/", codeSessionController.createLiveCodingSession);
router.patch("/:session_id", codeSessionController.saveLiveCodingSession);
router.post("/:session_id/run", codeSessionController.executeCurrentCode);

export default router;