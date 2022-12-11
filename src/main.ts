// --- Day 11: Monkey in the Middle ---
// As you finally start making your way upriver, you realize your pack is much lighter than you remember. Just then, one of the items from your pack goes flying overhead. Monkeys are playing Keep Away with your missing things!

// To get your stuff back, you need to be able to predict where the monkeys will throw your items. After some careful observation, you realize the monkeys operate based on how worried you are about each item.

// You take some notes (your puzzle input) on the items each monkey currently has, how worried you are about those items, and how the monkey makes decisions based on your worry level. For example:

// Monkey 0:
//   Starting items: 79, 98
//   Operation: new = old * 19
//   Test: divisible by 23
//     If true: throw to monkey 2
//     If false: throw to monkey 3

// Monkey 1:
//   Starting items: 54, 65, 75, 74
//   Operation: new = old + 6
//   Test: divisible by 19
//     If true: throw to monkey 2
//     If false: throw to monkey 0

// Monkey 2:
//   Starting items: 79, 60, 97
//   Operation: new = old * old
//   Test: divisible by 13
//     If true: throw to monkey 1
//     If false: throw to monkey 3

// Monkey 3:
//   Starting items: 74
//   Operation: new = old + 3
//   Test: divisible by 17
//     If true: throw to monkey 0
//     If false: throw to monkey 1
// Each monkey has several attributes:

// Starting items lists your worry level for each item the monkey is currently holding in the order they will be inspected.
// Operation shows how your worry level changes as that monkey inspects an item. (An operation like new = old * 5 means that your worry level after the monkey inspected the item is five times whatever your worry level was before inspection.)
// Test shows how the monkey uses your worry level to decide where to throw an item next.
// If true shows what happens with an item if the Test was true.
// If false shows what happens with an item if the Test was false.
// After each monkey inspects an item but before it tests your worry level, your relief that the monkey's inspection didn't damage the item causes your worry level to be divided by three and rounded down to the nearest integer.

// The monkeys take turns inspecting and throwing items. On a single monkey's turn, it inspects and throws all of the items it is holding one at a time and in the order listed. Monkey 0 goes first, then monkey 1, and so on until each monkey has had one turn. The process of each monkey taking a single turn is called a round.

// When a monkey throws an item to another monkey, the item goes on the end of the recipient monkey's list. A monkey that starts a round with no items could end up inspecting and throwing many items by the time its turn comes around. If a monkey is holding no items at the start of its turn, its turn ends.

// Figure out which monkeys to chase by counting how many items they inspect over 20 rounds. What is the level of monkey business after 20 rounds of stuff-slinging simian shenanigans?

type Worry = number;
type Item = {
    worry: Worry;
    throwTimes: number;
}

type MonkeyName = number;

type Monkey = {
    items: Item[];
    operation: '*' | '+';
    value: 'old' | number;
    testDivisor: number;
    ifTrue: MonkeyName;
    ifFalse: MonkeyName;
    inspectTimes: number;
}

const ROUND_COUNT = 20;
const TOP_MONKEY_COUNT = 2;
export const main = (input: string) => {
    // Blank line separates monkeys
    const monkeyInputs: string[][] = [];

    const lines = input.split('\n');
    let currentMonkey = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') {
            currentMonkey++;
        } else {
            monkeyInputs[currentMonkey] = monkeyInputs[currentMonkey] || [];
            monkeyInputs[currentMonkey].push(line);
        }
    }

    const monkeys = new Map<MonkeyName, Monkey>();
    monkeyInputs.forEach((monkeyInput) => {
        const nameLine = monkeyInput[0];
        const nameMatch = nameLine.match(/Monkey (?<name>\d):/);
        if (!nameMatch) {
            throw new Error(`Invalid monkey name: ${nameLine}`);
        }
        const name = parseInt(nameMatch.groups.name, 10);

        const startingItemsLine = monkeyInput[1];
        const startingItemsMatch = startingItemsLine.match(/Starting items: (?<items>(\d+(, \d+)*)?)/);
        if (!startingItemsMatch) {
            throw new Error(`Invalid starting items: ${startingItemsLine}`);
        }
        const startingItems = startingItemsMatch.groups.items.split(', ').map((item) => parseInt(item, 10));

        const operationLine = monkeyInput[2];
        const operationMatch = operationLine.match(/Operation: new = old (?<operation>[*+]) (?<value>\d+|old)/);
        if (!operationMatch) {
            throw new Error(`Invalid operation: ${operationLine}`);
        }
        const operation = operationMatch.groups.operation as '*' | '+';
        const value = operationMatch.groups.value === 'old' ? 'old' : parseInt(operationMatch.groups.value, 10);

        const testLine = monkeyInput[3];
        const testMatch = testLine.match(/Test: divisible by (?<divisor>\d+)/);
        if (!testMatch) {
            throw new Error(`Invalid test: ${testLine}`);
        }
        const testDivisor = parseInt(testMatch.groups.divisor, 10);

        const ifTrueLine = monkeyInput[4];
        const ifTrueMatch = ifTrueLine.match(/If true: throw to monkey (?<monkey>\d)/);
        if (!ifTrueMatch) {
            throw new Error(`Invalid if true: ${ifTrueLine}`);
        }
        const ifTrue = parseInt(ifTrueMatch.groups.monkey, 10);

        const ifFalseLine = monkeyInput[5];
        const ifFalseMatch = ifFalseLine.match(/If false: throw to monkey (?<monkey>\d)/);
        if (!ifFalseMatch) {
            throw new Error(`Invalid if false: ${ifFalseLine}`);
        }
        const ifFalse = parseInt(ifFalseMatch.groups.monkey, 10);

        monkeys.set(name, {
            items: startingItems.map((worry) => ({ worry, throwTimes: 0 })),
            operation,
            value,
            testDivisor,
            ifTrue,
            ifFalse,
            inspectTimes: 0,
        });
    });

    const executeTurn = (monkey: Monkey) => {
        const items = monkey.items;
        monkey.items = [];
        items.forEach((item) => {
            const value = monkey.value === 'old' ? item.worry : monkey.value;
            item.worry = {
                '*': (old: Worry) => old * value,
                '+': (old: Worry) => old + value,
            }[monkey.operation](item.worry);

            item.worry = Math.floor(item.worry / 3);

            monkey.inspectTimes += 1;

            const throwTo = item.worry % monkey.testDivisor === 0 ? monkey.ifTrue : monkey.ifFalse;

            monkeys.get(throwTo).items.push(item);
        });
    }

    const executeRound = () => {
        monkeys.forEach((monkey) => {
            executeTurn(monkey);
        });
    }

    for (let i = 0; i < ROUND_COUNT; i++) {
        executeRound();
    }

    const topMonkeys = Array.from(monkeys.values())
        .sort((a, b) => b.inspectTimes - a.inspectTimes)
        .slice(0, TOP_MONKEY_COUNT);

    return topMonkeys.reduce((acc, monkey) => acc * monkey.inspectTimes, 1);
}