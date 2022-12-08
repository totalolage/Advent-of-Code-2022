import { main } from "../src/main.js";

describe('main', () => {
    it('should be defined', () => {
        expect(main).toBeDefined();
    });

    const testData = [
        {input: 'This is a test', output: 'This is a test'},
    ]

    testData.forEach(({input, output}) => {
        it(`should return ${output} for ${input}`, () => {
            expect(main(input)).toEqual(output);
        });
    });
});