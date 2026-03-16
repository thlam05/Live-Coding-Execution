import db from "../configs/db.js";

export function createExecution({ session_id }) {
    return db("executions")
        .insert({
            session_id: session_id,
            status: "QUEUED",
            started_at: new Date()
        })
        .returning("*");
}

export function getExecution({ execution_id }) {
    return db("executions")
        .where({ id: execution_id })
}