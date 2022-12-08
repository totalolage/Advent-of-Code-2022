import { main } from "../src/main.js";

describe('main', () => {
    it('should be defined', () => {
        expect(main).toBeDefined();
    });

    const testData = [
        {input: 'This is a test', expected: 'This is a test'},
    ]

    testData.forEach(({input, expected}) => {
        it(`should return ${expected} for ${input}`, () => {
            expect(main(input)).toEqual(expected);
        });
    });
});