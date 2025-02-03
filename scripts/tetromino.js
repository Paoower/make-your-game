class Tetromino {
    constructor(type) {
        this.shapes = {
            I: [[1, 1, 1, 1]],
            O: [[1, 1], [1, 1]],
            T: [[0, 1, 0], [1, 1, 1]],
            S: [[0, 1, 1], [1, 1, 0]],
            Z: [[1, 1, 0], [0, 1, 1]],
            J: [[1, 0, 0], [1, 1, 1]],
            L: [[0, 0, 1], [1, 1, 1]]
        };
        this.type = type;
        this.shape = this.shapes[type];
        this.x = 3;
        this.y = -2; // Start 2 lines above the board
    }

    rotate() {
        const newShape = [];
        for(let i = 0; i < this.shape[0].length; i++) {
            newShape.push([]);
            for(let j = this.shape.length - 1; j >= 0; j--) {
                newShape[i].push(this.shape[j][i]);
            }
        }
        return newShape;
    }
}