import fs from "fs";
import path from "path";

export function writeFileSourceCode({ language, source_code, execution_id }) {
    let folderPath;
    let fileName;

    if (language === "javascript") {
        folderPath = path.resolve("source_code/javascript");
        fileName = `${execution_id}.js`;
    }
    else if (language === "python") {
        folderPath = path.resolve("source_code/python");
        fileName = `${execution_id}.py`;
    }
    else {
        throw new Error("Unsupported language");
    }

    try {
        fs.mkdir(folderPath, { recursive: true }, () => { });

        const filePath = path.join(folderPath, fileName);

        fs.writeFile(filePath, source_code, () => { });

        return {
            fileName,
            filePath
        };
    } catch (error) {
        console.log(`ERROR: ${error.message}`);
    }
}