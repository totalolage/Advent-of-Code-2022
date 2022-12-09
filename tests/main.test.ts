import { main } from "../src/main.js";

describe('main', () => {
    it('should be defined', () => {
        expect(main).toBeDefined();
    });

    const testData = [
        {
            input: [
                'R 4',
                'U 4',
                'L 3',
                'D 1',
                'R 4',
                'D 1',
                'L 5',
                'R 2',
            ].join('\n'),
            expected: 13
        },
    ]

    testData.forEach(({input, expected}) => {
        it(`should return ${expected} for ${input}`, () => {
            expect(main(input)).toEqual(expected);
        });
    });
});