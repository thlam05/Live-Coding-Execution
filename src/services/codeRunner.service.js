import { exec } from "child_process";

const ALLOWED_LANGUAGES = ["javascript", "python"];

export function runCode(language, source_code) {
    return new Promise((resolve, reject) => {

        if (!ALLOWED_LANGUAGES.includes(language)) {
            return reject(new Error("Language not supported"));
        }

        const command = `node --max-old-space-size=64 -e "${source_code}"`;

        exec(
            command,
            { timeout: 2000 },
            (error, stdout, stderr) => {
                if (error) {
                    return resolve({
                        stdout,
                        stderr: error.killed
                            ? "Execution timed out"
                            : error.message
                    });
                }

                resolve({ stdout, stderr });
            }
        );
    });
}