import db from "../configs/db.js";

export function createLiveCodingSession({ language, source_code, status }) {
    return db("code_sessions")
        .insert({ language, source_code, status })
        .returning("*");
}

export function saveCodeSession({ session_id, language, source_code }) {
    return db("code_sessions")
        .where({ id: session_id })
        .update({ language, source_code, updated_at: new Date() })
        .returning("*");
}

export function findCodeSession({ session_id }) {
    return db("code_sessions")
        .where({ id: session_id })
}