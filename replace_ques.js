// Replace question data in script.js with AES-GCM encrypted data
const fs = require('fs');

const scriptPath = 'script.js';
const encryptedPath = 'encrypted_ques_aes.js';

// Read both files
const script = fs.readFileSync(scriptPath, 'utf8');
const encryptedData = fs.readFileSync(encryptedPath, 'utf8');

// Find the ques object boundaries in script.js
const quesStart = script.indexOf('const ques = {');
if (quesStart === -1) {
    console.error('Could not find "const ques = {" in script.js');
    process.exit(1);
}

// Find the matching closing brace by counting braces
let braceCount = 0;
let quesEnd = -1;
let inString = false;
let escapeNext = false;

for (let i = quesStart; i < script.length; i++) {
    const ch = script[i];

    if (escapeNext) {
        escapeNext = false;
        continue;
    }

    if (ch === '\\') {
        escapeNext = true;
        continue;
    }

    if (ch === '"' && !escapeNext) {
        inString = !inString;
        continue;
    }

    if (inString) continue;

    if (ch === '{') braceCount++;
    if (ch === '}') {
        braceCount--;
        if (braceCount === 0) {
            // Check for semicolon after
            quesEnd = i + 1;
            if (script[quesEnd] === ';') quesEnd++;
            break;
        }
    }
}

if (quesEnd === -1) {
    console.error('Could not find end of ques object');
    process.exit(1);
}

console.log(`Found ques object: chars ${quesStart} to ${quesEnd}`);
console.log(`Original ques length: ${quesEnd - quesStart} chars`);

// Build the new script
const before = script.substring(0, quesStart);
const after = script.substring(quesEnd);

const newScript = before + encryptedData + after;

// Write back
fs.writeFileSync(scriptPath, newScript, 'utf8');

console.log(`New script.js size: ${newScript.length} chars`);
console.log('Done! Question data replaced with AES-GCM encrypted version.');
