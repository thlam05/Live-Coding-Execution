import { exec } from "child_process";
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
        exec(
            command,
            { timeout: 2000 },
            (error, stdout, stderr) => {
                if (error) {
                    return resolve({
                        stdout,
                        stderr: error.killed
                            ? "Execution timed out"
                            : stderr || error.message
                    });
                }

                resolve({ stdout, stderr });
            }
        );
    });
}