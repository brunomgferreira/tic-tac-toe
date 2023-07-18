const Player = (sign) => {
    this.sign = sign;

    const getSign = () => {
        return sign;
    };

    return { getSign };
};

const gameBoard = (() => {
    const board = ['','','','','','','','',''];

    const setBox = (index, sign) => {
        if (index > board.length) return;
        board[index] = sign;
    };

    const getBox = (index) => {
        if (index > board.length) return;
        return board[index];
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    return {setBox, getBox, reset};
})();

const displayController = (() => {
    const gameBoxes = document.querySelectorAll('.game-box');
    const restartButton = document.getElementById('restart-button');
    const messageElement = document.getElementById('message');

    gameBoxes.forEach((gameBox) => {
        gameBox.addEventListener('click', (e) => {
            if (gameController.getIsOver() || e.target.textContent !== '') return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameBoard();
        });
    });

    restartButton.addEventListener('click', (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameBoard();
        setMessageElement("Player X's turn");
    });

    const updateGameBoard = () => {
        for(let i = 0; i < gameBoxes.length; i++) {
            gameBoxes[i].textContent = gameBoard.getBox(i);
        }
    };
    
    const setResultMessage = (winner) => {
        if (winner == 'Draw') {
            setMessageElement("It's a draw!");
        }
        else {
            setMessageElement(`Player ${winner} has won!`)
        }
    };

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };
    
    return {setResultMessage, setMessageElement};
})();

const gameController = (() => {
    const playerX = Player('X');
    const playerO = Player('O');
    let round = 1;
    let isOver = false;

    const playRound = (index) => {
        gameBoard.setBox(index, getCurrentPlayerSign());
        if (checkWinner(index)) {
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round === 9) {
            displayController.setResultMessage('Draw');
            isOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(
            `Player ${getCurrentPlayerSign()}'s turn`
        );
    };

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };

    const checkWinner = (index) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winConditions
        .filter((combination) => combination.includes(index))
        .some((possibleCombination) => possibleCombination.every(
            (index) => gameBoard.getBox(index) === getCurrentPlayerSign()
        ));
    };

    const getIsOver = () => {
        return isOver;
    };

    const reset = () => {
        round = 1;
        isOver = false;
    };
    
    return {playRound, getIsOver, reset};
})();