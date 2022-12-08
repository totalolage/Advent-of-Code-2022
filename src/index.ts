import fs from 'fs';
import { main } from './main.js';

const input = fs.readFileSync('input.txt', 'utf-8');

console.log(main(input, { mode: 'delete', totalSpace: 70000000, spaceNeeded: 30000000 }));