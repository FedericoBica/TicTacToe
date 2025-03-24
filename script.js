function gameBoard(){
    const row = 3;
    const column = 3;
    const board = [];

    for (let i=0; i < row; i++) {
        board[i] = [];
        for (let j=0; j < column; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const getToken = (row, column, player) => {
        if (board[row][column].getValue() === null){
            board[row][column].addToken(player);
            return true;
        }
        return false;
    };

    const printBoard = () => {
        const boardWithCells = board.map(row => 
            row.map(cell => cell.getValue() || "_").join(" ")).join("\n");
        console.log(boardWithCells);
    };

    return {getBoard, getToken, printBoard};
}

function Cell () {
    let value = null;
    const addToken = (player) => {
        if (value === null) {
            value = player;
        }
    };

    const getValue = () => value;

    return {addToken,getValue};

}

function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = gameBoard();

    const players = [
        {
        name: playerOneName,
        token: "X"
        },
        {
        name: playerTwoName,
        token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;
    let gameOver = false;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = () => {
        const boardArr = board.getBoard();

        for (let i = 0; i < 3; i++) {
            if (boardArr[i][0].getValue() !== null && 
                boardArr[i][0].getValue() === boardArr[i][1].getValue() && 
                boardArr[i][0].getValue() === boardArr[i][2].getValue()) {
                return true;
            }
        }   
        for (let i = 0; i < 3; i++) {
            if (boardArr[0][i].getValue() !== null && 
                boardArr[0][i].getValue() === boardArr[1][i].getValue() && 
                boardArr[0][i].getValue() === boardArr[2][i].getValue()) {
                return true;
            }
        }   
        if (boardArr[0][0].getValue() !== null && 
            boardArr[0][0].getValue() === boardArr[1][1].getValue() && 
            boardArr[0][0].getValue() === boardArr[2][2].getValue()) {
            return true;
        }   
        if (boardArr[0][2].getValue() !== null && 
            boardArr[0][2].getValue() === boardArr[1][1].getValue() && 
            boardArr[0][2].getValue() === boardArr[2][0].getValue()) {
            return true;
        }   
        return false;
     }

     const playRound = (row,column) => {
        if (board.getToken(row,column,getActivePlayer().token)) {
            if(checkWinner()) {
                gameOver = true;
                //alert(`${getActivePlayer.name} wins`);
                //updateScreen();
                return;
            }
            switchPlayerTurn();
        } 
    };

    const isGameOver = () => gameOver;


    printNewRound();

    return {playRound, getActivePlayer, getBoard: board.getBoard, isGameOver}
}

function screenController () {
    let game = gameController();
    const playerTurnDiv = document.getElementById("turn");
    const boardDiv = document.getElementById("board");
    const playButton = document.getElementById("play");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = game.isGameOver() ? `${activePlayer.name} wins!` : `${activePlayer.name}'s turn.`;

        board.forEach((row, rowIndex) => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("row");

            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue() || " ";
                rowDiv.appendChild(cellButton);
            });
            boardDiv.appendChild(rowDiv);
        });
    }
    function clickHandlerBoard(e) {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;

        if (!game.isGameOver()) {
            game.playRound(parseInt(row), parseInt(column));
            updateScreen();
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    playButton.addEventListener("click", () => {
       game = gameController();
        updateScreen();
    });

    updateScreen();
}

screenController();