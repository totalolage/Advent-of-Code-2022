// --- Day 10: Cathode-Ray Tube ---
// You avoid the ropes, plunge into the river, and swim to shore.

// The Elves yell something about meeting back up with them upriver, but the river is too loud to tell exactly what they're saying. They finish crossing the bridge and disappear from view.

// Situations like this must be why the Elves prioritized getting the communication system on your handheld device working. You pull it out of your pack, but the amount of water slowly draining from a big crack in its screen tells you it probably won't be of much immediate use.

// Unless, that is, you can design a replacement for the device's video system! It seems to be some kind of cathode-ray tube screen and simple CPU that are both driven by a precise clock circuit. The clock circuit ticks at a constant rate; each tick is called a cycle.

// Start by figuring out the signal being sent by the CPU. The CPU has a single register, X, which starts with the value 1. It supports only two instructions:

// addx V takes two cycles to complete. After two cycles, the X register is increased by the value V. (V can be negative.)
// noop takes one cycle to complete. It has no other effect.
// The CPU uses these instructions in a program (your puzzle input) to, somehow, tell the screen what to draw.

// Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles. What is the sum of these six signal strengths?

// --- Part Two ---
// It seems like the X register controls the horizontal position of a sprite. Specifically, the sprite is 3 pixels wide, and the X register sets the horizontal position of the middle of that sprite. (In this system, there is no such thing as "vertical position": if the sprite's horizontal position puts its pixels where the CRT is currently drawing, then those pixels will be drawn.)

// You count the pixels on the CRT: 40 wide and 6 high. This CRT screen draws the top row of pixels left-to-right, then the row below that, and so on. The left-most pixel in each row is in position 0, and the right-most pixel in each row is in position 39.

// Like the CPU, the CRT is tied closely to the clock circuit: the CRT draws a single pixel during each cycle. Representing each pixel of the screen as a #, here are the cycles during which the first and last pixel in each row are drawn:

// Cycle   1 -> ######################################## <- Cycle  40
// Cycle  41 -> ######################################## <- Cycle  80
// Cycle  81 -> ######################################## <- Cycle 120
// Cycle 121 -> ######################################## <- Cycle 160
// Cycle 161 -> ######################################## <- Cycle 200
// Cycle 201 -> ######################################## <- Cycle 240
// So, by carefully timing the CPU instructions and the CRT drawing operations, you should be able to determine whether the sprite is visible the instant each pixel is drawn. If the sprite is positioned such that one of its three pixels is the pixel currently being drawn, the screen produces a lit pixel (#); otherwise, the screen leaves the pixel dark (.).

enum Operation {
    AddX = 'addx',
    NoOp = 'noop',
}
type Instruction = [Operation.AddX, number] | [Operation.NoOp];

const cycleCost: Record<Operation, number> = {
    [Operation.AddX]: 2,
    [Operation.NoOp]: 1,
};

const parseInstruction = (line: string): Instruction => {
    const match = line.match(/^(?<op>\w+)(?: (?<val>-?\d+))?$/);
    if (!match) {
        throw new Error(`Invalid instruction: ${line}`);
    }

    const { op, val } = match.groups!;
    if (op === 'addx') {
        return [Operation.AddX, parseInt(val, 10)];
    } else {
        return [Operation.NoOp];
    }
};

const CRT_WIDTH = 40;
const SPRITE_WIDTH = 3;
export const main = (input: string) => {
    const instructions = input.split('\n').map(parseInstruction);

    let x = 1;
    const crt = [];

    let cycle = 1;
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];

        // console.log(`Cycle ${cycle}: ${instruction}`);
        for (let j = 0; j < cycleCost[instruction[0]]; j++) {
            const crtColIndex = (cycle - 1) % CRT_WIDTH;

            const spriteSpread = (SPRITE_WIDTH - 1) / 2;
            const isSpriteOnThisPixel = Math.abs(x - crtColIndex) <= spriteSpread;

            const crtRow = crt[Math.floor((cycle - 1) / CRT_WIDTH)] || [];
            crtRow[crtColIndex] = isSpriteOnThisPixel ? '#' : '.';
            crt[Math.floor((cycle - 1) / CRT_WIDTH)] = crtRow;

            cycle += 1;
        }

        if (instruction[0] === 'addx') {
            x += instruction[1];
        }
    }

    // Print the CRT
    const out = crt.map(row => row.join('')).join('\n');
    return out;
}