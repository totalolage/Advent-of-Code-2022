import { main } from "../src/main.js";

describe('main', () => {
    it('should be defined', () => {
        expect(main).toBeDefined();
    });

    const testData = [
        {
            input: [
                '30373',
                '25512',
                '65332',
                '33549',
                '35390',
            ].join('\n'),
            expected: 8
        },
    ]

    testData.forEach(({input, expected}) => {
        it(`should return ${expected} for ${input}`, () => {
            expect(main(input)).toEqual(expected);
        });
    });
});