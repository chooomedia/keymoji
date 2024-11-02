// scripts/update-timestamp.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/updatedTime.js');
const timestamp = new Date().toISOString();

// Set only the required export statement
const content = `export const updatedTime = '${timestamp}';\n`;

fs.writeFileSync(filePath, content, 'utf8');
console.log(`updatedTime.js updated with timestamp: ${timestamp}`);
