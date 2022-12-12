// --- Day 12: Hill Climbing Algorithm ---
// You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.

// You ask the device for a heightmap of the surrounding area (your puzzle input). The heightmap shows the local area from above broken into a grid; the elevation of each square of the grid is given by a single lowercase letter, where a is the lowest elevation, b is the next-lowest, and so on up to the highest elevation, z.

// Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E). Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.

// You'd like to reach E, but to save energy, you should do it in as few steps as possible. During each step, you can move exactly one square up, down, left, or right. To avoid needing to get out your climbing gear, the elevation of the destination square can be at most one higher than the elevation of your current square; that is, if your current elevation is m, you could step to elevation n, but not to elevation o. (This also means that the elevation of the destination square can be much lower than the elevation of your current square.)

// --- Part Two ---
// As you walk up the hill, you suspect that the Elves will want to turn this into a hiking trail. The beginning isn't very scenic, though; perhaps you can find a better starting point.

// To maximize exercise while hiking, the trail should start as low as possible: elevation a. The goal is still the square marked E. However, the trail should still be direct, taking the fewest steps to reach its goal. So, you'll need to find the shortest path from any square at elevation a to the square marked E.

// What is the fewest steps required to move starting from any square with elevation a to the location that should get the best signal?

enum Height {
    a = 0,
    b = 1,
    c = 2,
    d = 3,
    e = 4,
    f = 5,
    g = 6,
    h = 7,
    i = 8,
    j = 9,
    k = 10,
    l = 11,
    m = 12,
    n = 13,
    o = 14,
    p = 15,
    q = 16,
    r = 17,
    s = 18,
    t = 19,
    u = 20,
    v = 21,
    w = 22,
    x = 23,
    y = 24,
    z = 25,
}


type Grid = Height[][];

type Position = {
    x: number;
    y: number;
}

enum Direction {
    Up = '^',
    Down = 'v',
    Left = '<',
    Right = '>',
}

type Move = {
    position: Position;
    direction: Direction;
}

type Dimensions = {
    width: number;
    height: number;
}

type ExploreState = {
    moves: Move[];
    distanceToGoal: number;
}

export const main = (input: string) => {
    const grid: Grid = [];
    let start: Position;
    let end: Position;

    // Parse input
    input.split('\n').forEach((line, y) => {
        grid[y] = [];
        line.split('').forEach((char, x) => {
            switch (char) {
                case 'S': grid[y][x] = Height.a; break;
                case 'a': grid[y][x] = Height.a; break;
                case 'b': grid[y][x] = Height.b; break;
                case 'c': grid[y][x] = Height.c; break;
                case 'd': grid[y][x] = Height.d; break;
                case 'e': grid[y][x] = Height.e; break;
                case 'f': grid[y][x] = Height.f; break;
                case 'g': grid[y][x] = Height.g; break;
                case 'h': grid[y][x] = Height.h; break;
                case 'i': grid[y][x] = Height.i; break;
                case 'j': grid[y][x] = Height.j; break;
                case 'k': grid[y][x] = Height.k; break;
                case 'l': grid[y][x] = Height.l; break;
                case 'm': grid[y][x] = Height.m; break;
                case 'n': grid[y][x] = Height.n; break;
                case 'o': grid[y][x] = Height.o; break;
                case 'p': grid[y][x] = Height.p; break;
                case 'q': grid[y][x] = Height.q; break;
                case 'r': grid[y][x] = Height.r; break;
                case 's': grid[y][x] = Height.s; break;
                case 't': grid[y][x] = Height.t; break;
                case 'u': grid[y][x] = Height.u; break;
                case 'v': grid[y][x] = Height.v; break;
                case 'w': grid[y][x] = Height.w; break;
                case 'x': grid[y][x] = Height.x; break;
                case 'y': grid[y][x] = Height.y; break;
                case 'z': grid[y][x] = Height.z; break;
                case 'E': grid[y][x] = Height.z; end = { x, y }; break;
                default:
                    throw new Error(`Unexpected character: ${char}`);
            }
        });
    });

    const dimensions: Dimensions = {
        width: grid[0].length,
        height: grid.length,
    };
    const distanceBetween = (lhs: Position, rhs: Position): number => (
        // Math.sqrt(
        //     Math.pow(lhs.x - rhs.x, 2) +
        //     Math.pow(lhs.y - rhs.y, 2) +
        //     Math.pow(grid[lhs.y][lhs.x] - grid[rhs.y][rhs.x], 2)
        // )
        Math.abs(lhs.x - rhs.x) +
        Math.abs(lhs.y - rhs.y) +
        Math.abs(grid[lhs.y][lhs.x] - grid[rhs.y][rhs.x])
    );
    const isSamePosition = (lhs: Position, rhs: Position): boolean => lhs.x === rhs.x && lhs.y === rhs.y;
    const step = ({ position: { x, y }, direction }: Move): Position => {
        switch (direction) {
            case Direction.Up: return { x, y: y - 1 };
            case Direction.Down: return { x, y: y + 1 };
            case Direction.Left: return { x: x - 1, y };
            case Direction.Right: return { x: x + 1, y };
        }
    };
    const positionFromMoves = (moves: Move[]): Position => {
        if (moves.length === 0) {
            return start;
        }
        return step(moves[moves.length - 1])
    };
    const isMoveLegal = (move: Move): boolean => {
        // console.log("move", move);
        // console.log("past moves", pastMoves);
        const { width, height } = dimensions;
        const destination = step(move);
        // Step out of bounds
        if (destination.x < 0 || destination.y < 0 || destination.x >= width || destination.y >= height) {
            // console.log(move.direction, '-out of bounds');
            return false;
        }
        // Too high
        if (grid[destination.y][destination.x] > grid[move.position.y][move.position.x] + 1) {
            // console.log(move.direction, '-too high');
            return false;
        }
        // console.log(move.direction, '+ok');
        return true;
    };

    type StrLoc = `${number},${number}`;
    const stringifyLocation = (location: Position): StrLoc => `${location.x},${location.y}`;
    // const parseLocation = (location: StrLoc): Position => {
    //     const [x, y] = location.split(',').map(Number);
    //     return { x, y };
    // }

    const solve = () => {
        // States that have already been explored
        const closedStates = new Set<StrLoc>();

        // States that have been discovered but not yet explored, together with their distance to the end
        const openStates: ExploreState[] = [];

        // const printState = (state: ExploreState): string => {
        //     const output: string[][] = Array(dimensions.height).fill(0)
        //         .map(() => Array(dimensions.width).fill('.'));

        //     // Mark closed states
        //     closedStates.forEach((loc) => {
        //         const { x, y } = parseLocation(loc);
        //         output[y][x] = 'X';
        //     });

        //     // Mark open states
        //     openStates.forEach(({ moves }) => {
        //         const { x, y } = positionFromMoves(moves);
        //         output[y][x] = 'O';
        //     });

        //     // Mark path
        //     state.moves.forEach((move) => {
        //         const { x, y } = move.position;
        //         output[y][x] = move.direction;
        //     });

        //     // Mark current position
        //     const currentPos = positionFromMoves(state.moves);
        //     output[currentPos.y][currentPos.x] = String.fromCharCode(97 + grid[currentPos.y][currentPos.x]);

        //     // Mark end position
        //     output[end.y][end.x] = 'E';

        //     return output.map(row => row.join('')).join('\n');
        // };

        const stateCompare = (lhs: ExploreState, rhs: ExploreState): -1 | 0 | 1 => {
            const lhsCost = lhs.moves.length + lhs.distanceToGoal;
            const rhsCost = rhs.moves.length + rhs.distanceToGoal;
            return lhsCost < rhsCost ? -1 : lhsCost > rhsCost ? 1 : 0;
        };

        const pushStateToExplore = (moves: Move[]): void => {
            const position = positionFromMoves(moves);
            const key = stringifyLocation(position);

            // Don't explore states that have already been explored
            if (closedStates.has(key)) {
                return;
            }
            const distanceToGoal = distanceBetween(position, end);
            const newState: ExploreState = { moves, distanceToGoal };

            // Don't explore states that have already been discovered
            const existingStateIndex = openStates.findIndex((state) => isSamePosition(positionFromMoves(state.moves), position));
            if (existingStateIndex !== -1) {
                // If the new state wouldn't be better than the existing state, don't add it
                if (stateCompare(openStates[existingStateIndex], newState) !== 1) {
                    return;
                }
                // Otherwise, remove the existing state
                openStates.splice(existingStateIndex, 1);
            }

            // Add new state to the list of states to explore, sorted by cost
            const insertIndex = openStates.findIndex((state) => stateCompare(state, newState) === 1);
            if (insertIndex === -1) {
                openStates.push(newState);
            } else {
                openStates.splice(insertIndex, 0, newState);
            }
        };

        const popNextStateToExplore = (): ExploreState => {
            const next = openStates.shift()!;
            closedStates.add(stringifyLocation(positionFromMoves(next.moves)));
            return next;
        };

        const exploreState = (state: ExploreState): void => {
            const moves = state.moves;
            const position = positionFromMoves(moves);

            // Explore all possible moves
            Object.values(Direction)
                .map((direction): Move => ({ position, direction }))
                // Filter out illegal moves
                .filter(isMoveLegal)
                // Explore each move
                .forEach((move) => {
                    pushStateToExplore([...moves, move]);
                });
        };

        const isGoalState = ({moves}: ExploreState): boolean => isSamePosition(positionFromMoves(moves), end);

        // Push the first state to explore
        openStates.push({ moves: [], distanceToGoal: distanceBetween(start, end) });
        for (let iter_count = 0; openStates.length > 0; iter_count++) {
            const state = popNextStateToExplore();
            // console.clear();
            // console.log('-'.repeat(dimensions.width));
            // console.log(openStates.map(state => state.moves.length + state.distanceToGoal));
            // console.log(printState(state));
            if (isGoalState(state)) {
                console.log("Found solution in", state.moves.length, "moves over", iter_count, "iterations");
                return state.moves.length;
            };
            exploreState(state);
        }

        console.log("No solution found");
        return null;
    };

    const allPossibleStartingPositions: Position[] = [];
    for (let y = 0; y < dimensions.height; y++) {
        for (let x = 0; x < dimensions.width; x++) {
            if (grid[y][x] === Height.a) {
                allPossibleStartingPositions.push({ x, y });
            }
        }
    }

    let bestSolutionLength = Infinity;
    for (const startingPosition of allPossibleStartingPositions) {
        start = startingPosition;
        const solutionLength = solve();
        if (solutionLength !== null && solutionLength < bestSolutionLength) {
            bestSolutionLength = solutionLength;
        }
    }

    console.log("Best solution length:", bestSolutionLength);
    return bestSolutionLength;
};
