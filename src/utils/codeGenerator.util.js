
const templateCode = {
    python: `print("Hello World")`,

    javascript: `console.log("Hello World")`
}


export function generateTemplateCode(language) {
    const _language = language.trim().toLowerCase();
    if (_language == "javascript")
        return templateCode.javascript;
    else if (_language == "python")
        return templateCode.python;
}