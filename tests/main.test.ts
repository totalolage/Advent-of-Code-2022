import { main } from "../src/main.js";

describe('main', () => {

    const jestConsole = console;

    beforeEach(() => {
        global.console = require('console');
    });

    afterEach(() => {
        global.console = jestConsole;
    });

    it('should be defined', () => {
        expect(main).toBeDefined();
    });

    const testData = [
        {
            input: [
                'Sabqponm',
                'abcryxxl',
                'accszExk',
                'acctuvwj',
                'abdefghi',
            ].join('\n'),
            expected: 31,
        },
    ]

    testData.forEach(({input, expected}) => {
        it(`should return ${expected} for ${input}`, () => {
            expect(main(input)).toEqual(expected);
        });
    });
});