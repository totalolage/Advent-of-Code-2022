// 1000
// 2000
// 3000

// 4000

// 5000
// 6000

// 7000
// 8000
// 9000

// 10000

// This list represents the Calories of the food carried by five Elves.
// In case the Elves get hungry and need extra snacks, they need to know which Elf to ask: they'd like to know how many Calories are being carried by the Elf carrying the most Calories. In the example above, this is 24000 (carried by the fourth Elf).
// Find the Elf carrying the most Calories.How many total Calories is that Elf carrying ?

import fs from 'fs';

const list = fs.readFileSync('input.txt', 'utf-8');
const lines = list.split('\n');

const elves = lines.reduce((allElves, line) => {
    if (line === '') {
        return [...allElves, 0]
    }

    const calories = parseInt(line, 10);
    const currentElf = allElves[allElves.length - 1];
    return [...allElves.slice(0, -1), currentElf + calories];
}, [0]);

// console.log(Math.max(...elves));

// By the time you calculate the answer to the Elves' question, they've already realized that the Elf carrying the most Calories of food might eventually run out of snacks.

// To avoid this unacceptable situation, the Elves would instead like to know the total Calories carried by the top three Elves carrying the most Calories.That way, even if one of those Elves runs out of snacks, they still have two backups.

// In the example above, the top three Elves are the fourth Elf(with 24000 Calories), then the third Elf(with 11000 Calories), then the fifth Elf(with 10000 Calories). The sum of the Calories carried by these three elves is 45000.

// Find the top three Elves carrying the most Calories.How many Calories are those Elves carrying in total ?

const topThree = elves.sort((a, b) => b - a).slice(0, 3);
console.log(topThree.reduce((a, b) => a + b, 0));