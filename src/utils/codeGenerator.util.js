
const templateCode = {
    python: `print("Hello World")`,

    javascript: `console.log("Hello World")`,

    cpp: `
    #include <bits/stdc++.h>
    using namespace std;

    int main() {
        cout << "Hello World";    

        return 0;
    }
    `
}


export function generateTemplateCode(language) {
    const _language = language.trim().toLowerCase();
    if (_language == "javascript")
        return templateCode.javascript;
    else if (_language == "python")
        return templateCode.python;
}