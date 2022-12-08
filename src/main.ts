// --- Day 7: No Space Left On Device ---
// You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

// The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

// $ system-update --please --pretty-please-with-sugar-on-top
// Error: No space left on device
// Perhaps you can delete some files to make space for the update?

// You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k
// The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

// Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

// cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
// cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
// cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
// cd / switches the current directory to the outermost directory, /.
// ls means list. It prints out all of the files and directories immediately contained by the current directory:
// 123 abc means that the current directory contains a file named abc with size 123.
// dir xyz means that the current directory contains a directory named xyz.
// Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

// - / (dir)
//   - a (dir)
//     - e (dir)
//       - i (file, size=584)
//     - f (file, size=29116)
//     - g (file, size=2557)
//     - h.lst (file, size=62596)
//   - b.txt (file, size=14848514)
//   - c.dat (file, size=8504156)
//   - d (dir)
//     - j (file, size=4060174)
//     - d.log (file, size=8033020)
//     - d.ext (file, size=5626152)
//     - k (file, size=7214296)
// Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

// Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

// The total sizes of the directories above can be found as follows:

// The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
// The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
// Directory d has total size 24933642.
// As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
// To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

// Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?

export const main = (input: string, opts: {mode: 'sum', maxSize: number} | {mode: 'print'}) => {
    interface InodeBase {
        name: string,
        type: 'dir' | 'file',
    }
    interface File extends InodeBase {
        type: 'file';
        size: number;
    }
    interface Directory extends InodeBase {
        type: 'dir';
        content: Inode[];
        parent: Directory | null;
    }
    type Inode = File | Directory;

    const isDirectory = (inode: Inode): inode is Directory => inode.type === 'dir';

    let currentDir: Directory = {
        name: '/',
        type: 'dir',
        content: [],
        parent: null,
    }

    const processCD = (path: string) => {
        switch (path) {
            case '..': {
                if (currentDir.parent === null) {
                    throw new Error(`Unexpected parent directory`);
                }
                currentDir = currentDir.parent;
                break;
            }
            case '/': {
                while (currentDir.parent !== null) {
                    currentDir = currentDir.parent;
                }
                break;
            }
            default: {
                const dir = currentDir.content.find((item): item is Directory => isDirectory(item) && item.name === path);
                if (dir === undefined) {
                    throw new Error(`Directory ${path} not found in ${currentDir.name}`);
                }
                currentDir = dir;
                break;
            }
        }
    }

    const processLS = (dir: Directory, lsResult: string[]) => {
        for (const outLine of lsResult) {
            const match = outLine.match(/^((?<size>\d+)|(?<directory>dir)) (?<name>\S+)$/);
            if (match === null) {
                throw new Error(`Unexpected ls output line: ${outLine}`);
            }
            const { size, directory, name } = match.groups!;
            // console.log(outLine, {size, directory, name});
            if (directory === "dir") {
                dir.content.push({
                    name,
                    type: 'dir',
                    content: [],
                    parent: dir,
                });
            } else {
                dir.content.push({
                    name,
                    type: 'file',
                    size: parseInt(size, 10),
                });
            }
        }
    }

    const lines = input.split('\n');
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        const lineParts = line.split(' ');
        const firstPart = lineParts.shift();
        if (firstPart !== '$') {
            throw new Error(`Unexpected line ${lineIndex}: ${line}`);
        }

        const command = lineParts.shift();
        switch (command) {
            case 'cd': {
                const dirName = lineParts.shift();
                if (dirName === undefined) {
                    throw new Error(`Unexpected line ${lineIndex}: ${line}`);
                }
                processCD(dirName);
                break;
            }
            case 'ls': {
                const dirName = lineParts.shift();
                let dir: Directory;
                if (dirName === undefined) {
                    dir = currentDir;
                } else {
                    dir = currentDir.content.find((item): item is Directory => isDirectory(item) && item.name === dirName);
                    if (dir === undefined) {
                        throw new Error(`Directory ${dirName} not found in ${currentDir.name}`);
                    }
                }

                let lsOutput: string[] = [];
                for (let lsOutputIndex = lineIndex + 1; lsOutputIndex < lines.length && !lines[lsOutputIndex].startsWith('$'); lsOutputIndex++) {
                    lsOutput.push(lines[lsOutputIndex]);
                }
                lineIndex += lsOutput.length;
                processLS(dir, lsOutput);
                break;
            }
            default: {
                throw new Error(`Unexpected command ${command} in line ${lineIndex}: ${line}`);
            }
        }
    }

    // Return to root directory
    processCD('/');

    switch (opts.mode) {
        case 'print': {
            // Print the tree
            const output: string[] = [];
            const printTree = (dir: Directory, indent = 0) => {
                output.push('  '.repeat(indent) + '- ' + dir.name + ' (dir)');
                for (const item of dir.content) {
                    if (isDirectory(item)) {
                        printTree(item, indent + 1);
                    } else {
                        output.push('  '.repeat(indent + 1) + '- ' + item.name + " (file, size=" + item.size + ")");
                    }
                }
            }
            printTree(currentDir);
            return output.join('\n');
        }
        case 'sum': {
            const directoriesSmallerThanMaxSize: (Directory & {size: number})[] = [];
            const calculateSize = (dir: Directory): number => {
                let size = 0;
                for (const item of dir.content) {
                    if (isDirectory(item)) {
                        size += calculateSize(item);
                    } else {
                        size += item.size;
                    }
                }
                if (size <= opts.maxSize) {
                    directoriesSmallerThanMaxSize.push({ ...dir, size });
                }
                return size;
            }
            calculateSize(currentDir);
            return directoriesSmallerThanMaxSize.reduce((sum, dir) => sum + dir.size, 0);
        }
    }
}