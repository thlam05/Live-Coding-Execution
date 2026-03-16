import express from "express";
import codeSessionRouter from "./codeSession.route.js";
import executionRouter from "./executions.js";

export default function route(app) {
    app.use("/code-sessions", codeSessionRouter);
    app.use("/executions", executionRouter);
}