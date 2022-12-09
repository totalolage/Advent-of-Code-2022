import { main } from "../src/main.js";

describe('main', () => {
    it('should be defined', () => {
        expect(main).toBeDefined();
    });

    const testData = [
        {
            input: [[
                'R 4',
                'U 4',
                'L 3',
                'D 1',
                'R 4',
                'D 1',
                'L 5',
                'R 2',
            ].join('\n'), 9] as const,
            expected: 1
        },
        {
            input: [[
                'R 5',
                'U 8',
                'L 8',
                'D 3',
                'R 17',
                'D 10',
                'L 25',
                'U 20',
            ].join('\n'), 9] as const,
            expected: 36
        }
    ]

    testData.forEach(({input: [input, ropeLength], expected}) => {
        it(`should return ${expected} for ${input}`, () => {
            expect(main(input, ropeLength)).toEqual(expected);
        });
    });
});