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

export const main = (input: string, start: number, every: number) => {
    const instructions = input.split('\n').map(parseInstruction);

    let x = 1;
    let signalStrength = 0;

    let cycle = 1;
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];

        // console.log(`Cycle ${cycle}: ${instruction}`);
        for (let j = 0; j < cycleCost[instruction[0]]; j++) {
            if (cycle >= start && (cycle - start) % every === 0) {
                // console.log({cycle, x})
                signalStrength += x * cycle;
            }
            cycle += 1;
        }

        if (instruction[0] === 'addx') {
            x += instruction[1];
        }
    }

    return signalStrength;
}