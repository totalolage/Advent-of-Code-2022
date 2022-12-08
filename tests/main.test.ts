import { main } from "../src/main.js";

describe('main', () => {
    it('should be defined', () => {
        expect(main).toBeDefined();
    });
    it('should echo whatever is passed to it', () => {
        expect(main('hello')).toBe('hello');
    });
});