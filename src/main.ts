import fs from 'fs';

const file = fs.readFileSync('src/main.ts', 'utf-8');

console.log(file);