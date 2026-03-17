import { exec, spawn } from "child_process";
import { writeFileSourceCode } from "../utils/file.util.js";

const ALLOWED_LANGUAGES = ["javascript", "python"];

export function runCode({ language, source_code, execution_id }) {

    if (!ALLOWED_LANGUAGES.includes(language)) {
        throw new Error("Language not supported");
    }

    const { filePath } = writeFileSourceCode({
        language,
        source_code,
        execution_id
    });

    let command;

    if (language === "javascript") {
        command = `node --max-old-space-size=64 ${filePath}`;
    }
    else if (language === "python") {
        command = `python ${filePath}`;
    }

    return new Promise((resolve) => {
        const [_command, ...args] = command.split(' ');

        const child = spawn(_command, args, {
            timeout: 2000,
            shell: false
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            resolve({
                stdout,
                stderr: error.message
            });
        });

        child.on('close', (code, signal) => {
            if (signal === 'SIGTERM' || child.killed) {
                return resolve({
                    stdout,
                    stderr: "Execution timed out"
                });
            }

            if (code !== 0) {
                return resolve({
                    stdout,
                    stderr: stderr || `Process exited with code ${code}`
                });
            }

            resolve({ stdout, stderr });
        });
    });
}