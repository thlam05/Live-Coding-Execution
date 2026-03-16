import express from "express";
import codeSessionRouter from "./codeSession.route.js";
import executionRouter from "./execution.route.js";

export default function route(app) {
    app.use("/code-sessions", codeSessionRouter);
    app.use("/executions", executionRouter);
}