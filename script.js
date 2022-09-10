const puzzleBoard = document.getElementById("puzzle")
const solveButton = document.querySelector(".solve-button")
const resetButton = document.querySelector(".reset-button");
const squares = 81;
let submissions = [];

// Creating input elements
for (let i = 0; i < squares; i++) {
    const inputElement = document.createElement('input')
    inputElement.setAttribute('type', 'number')
    inputElement.setAttribute('min', '1')
    inputElement.setAttribute('max', '9')

    if (((i % 9 === 0 || i % 9 === 1 || i % 9 === 2) && i < 27)
        || ((i % 9 === 6 || i % 9 === 7 || i % 9 === 8) && i < 27)
        || ((i % 9 === 3 || i % 9 === 4 || i % 9 === 5) && i > 27 && i < 54)
        || ((i % 9 === 0 || i % 9 === 1 || i % 9 === 2) && i >= 54)
        || ((i % 9 === 6 || i % 9 === 7 || i % 9 === 8) && i > 54)
    ) {
        inputElement.classList.add('bg-grey');
    }

    puzzleBoard.appendChild(inputElement)
}

// Decorating each 3 x 3 grid
const decorateGrid = () => {
    const inputs = document.querySelectorAll('input');
    let i = 0;
    let j = 0;
    inputs.forEach((input) => {
        if (j === 9) {
            j = 0;
            i += 1;
        }
        if (i === 0) {
            input.style.borderTop = "2px solid black";
        }
        if (j === 0) {
            input.style.borderLeft = "2px solid black";
        }
        if (i % 3 === 2) {
            input.style.borderBottom = "2px solid black";
        }
        if (j % 3 === 2) {
            input.style.borderRight = "2px solid black";
        }
        j++;
    })

}

// Getting input values into an array
const joinValues = () => {
    submissions = [];
    const inputs = document.querySelectorAll('input')
    let subList = [];
    let i = 0;
    inputs.forEach((input) => {
        if (i === 0 && subList.length) {
            submissions.push([...subList]);
            subList = [];
        }
        if (input.value) {
            subList.push(input.value);
        } else {
            subList.push('.');
        }
        i = (i + 1) % 9;
    })
    submissions.push([...subList]);
}

// Function to check if a value can be placed in a particular cell
function isValid (board, row, col, c) {
    for (let i = 0; i < 9; i++) {
        // Checking for the current row
        if (board[row][i] === c && i !== col) {
            return false;
        }

        // Checking for the current column
        if (board[i][col] === c && i !== row) {
            return false;
        }

        // Checking for the current 3 x 3 grid
        let nRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        let nCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[nRow][nCol] === c && nRow !== row && nCol !== col) {
            return false;
        }
    }
    return true;
}

const isValidSudoku = function (submissions) {
    for (let i = 0; i < submissions.length; i++) {
        for (let j = 0; j < submissions[0].length; j++) {
            // Checking only if the current cell isn't empty
            if (submissions[i][j] !== ".") {
                if (!isValid(submissions, i, j, submissions[i][j])) {
                    return false;
                }
            }
        }
    }
    return true;
};

// Recursive function to solve a sudoku with given values
const solve = (board) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === '.') {
                for (let c = 1; c <= 9; c++) {
                    if (isValid(board, i, j, c.toString())) {
                        board[i][j] = c + "";
                        if (solve(board) === true) {
                            return true;
                        } else {
                            board[i][j] = ".";
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Fill board with result (solved sudoku)
const fillBoard = (submissions) => {
    const inputs = document.querySelectorAll('input');
    const result = submissions.flat();
    let i = 0;
    inputs.forEach((input) => {
        input.value = result[i++];
    })
}

decorateGrid();

const solveSudoku = () => {
    joinValues();
    let status = isValidSudoku(submissions);
    if (!status) {
        alert("Invalid sudoku. Please fill it differently.");
    } else {
        solve(submissions);
        fillBoard(submissions);
    }
}

solveButton.addEventListener('click', () => {
    solveSudoku();
})

function resetValues() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.value = "";
    })
}

resetButton.addEventListener('click', resetValues);