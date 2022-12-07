import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf-8');

// The expedition can depart as soon as the final supplies have been unloaded from the ships.Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

// The ship has a giant cargo crane capable of moving crates between stacks.To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully - planned steps.After the crates are rearranged, the desired crates will be at the top of each stack.

// The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

// They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure(your puzzle input).For example:

// [D]
// [N][C]
// [Z][M][P]
// 1   2   3

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2
// In this example, there are three stacks of crates.Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top.Stack 2 contains three crates; from bottom to top, they are crates M, C, and D.Finally, stack 3 contains a single crate, P.

//     Then, the rearrangement procedure is given.In each step of the procedure, a quantity of crates is moved from one stack to a different stack.In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

// [D]
// [N][C]
// [Z][M][P]
// 1   2   3
// In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved(D) ends up below the second and third crates:

// [Z]
// [N]
// [C][D]
// [M][P]
// 1   2   3
// Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

// [Z]
// [N]
// [M][D]
// [C][P]
// 1   2   3
// Finally, one crate is moved from stack 1 to stack 2:

// [Z]
// [N]
// [D]
// [C][M][P]
// 1   2   3
// The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

// After the rearrangement procedure completes, what crate ends up on top of each stack ?

type Crate = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
type Stack = Crate[];
type Stacks = Stack[];

type Instruction = {
    from: number;
    to: number;
    count: number;
};

// The stack count line separates the stacks from the instructions
const indexOfSeparatorLine = input.split('\n').findIndex(line => line === '');
if (indexOfSeparatorLine === -1) {
    throw new Error('Invalid input');
}

const parseStack = (stackIndex: number): Stack => {
    const stack: Stack = [];

    // Walk up the stack addin crates until we hit a blank line
    for (let crateIndex = 0; crateIndex < indexOfSeparatorLine-1; crateIndex++) {
        const line = input.split('\n')[indexOfSeparatorLine - crateIndex - 2];
        const maybeCrate = line.split('')[stackIndex * 4 + 1] as Crate | ' ' | undefined;
        // console.log({ stackIndex, crateIndex, maybeCrate })
        if (!maybeCrate || maybeCrate === ' ') {
            break;
        }
        stack.push(maybeCrate);
    }

    return stack;
}

const parseStacks = (input: string): Stacks => {
    const stacks: Stacks = [];
    const stackCountLine = input.split('\n')[indexOfSeparatorLine - 1];
    const stackCount = stackCountLine.split('').map(s => parseInt(s, 10)).filter(n => !isNaN(n)).length;

    for (let stackIndex = 0; stackIndex < stackCount; stackIndex++) {
        stacks.push(parseStack(stackIndex));
    }

    return stacks;
};

const stacks = parseStacks(input);

const parseInstruction = (line: string): Instruction => {
    const matches = line.match(/move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/);
    if (!matches) {
        throw new Error('Invalid instruction');
    }

    return {
        count: parseInt(matches.groups.count, 10),
        from: parseInt(matches.groups.from, 10),
        to: parseInt(matches.groups.to, 10),
    };
}

// console.log(stacks)

const instructions = input.split('\n').slice(indexOfSeparatorLine + 1).map(parseInstruction);

// console.log(instructions);

const move = (stacks: Stacks, instruction: Instruction): Stacks => {
    const fromStack = stacks[instruction.from - 1];
    const toStack = stacks[instruction.to - 1];

    if (fromStack.length < instruction.count) {
        throw new Error('Invalid instruction');
    }

    const cratesToMove = fromStack.slice(fromStack.length - instruction.count);
    const newFromStack = fromStack.slice(0, fromStack.length - instruction.count);
    const newToStack = [...toStack, ...cratesToMove.reverse()];

    return [
        ...stacks.slice(0, instruction.from - 1),
        newFromStack,
        ...stacks.slice(instruction.from),
    ].map((stack, index) => index === instruction.to - 1 ? newToStack : stack);
}

const outputStacks = instructions.reduce(move, stacks);

console.log(outputStacks.map(stack => stack[stack.length - 1]).join(''));