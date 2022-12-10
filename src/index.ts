import fs from 'fs';
import { main } from './main.js';

const input = fs.readFileSync('input.txt', 'utf-8');

console.log(main(input, 20, 40));