var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function canMove() {
    // Check if any move is possible
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] == board[r][c + 1] || board[c][r] == board[c + 1][r]) {
                return true;
            }
        }
    }
    return hasEmptyTile();
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192"); // any # higher than 8192 has same color
        }
    }
}

document.addEventListener("keyup", (e) => {
    let moved = false;
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        moved = slideLeft();
    } else if (e.code == "ArrowRight" || e.code == "KeyD") {
        moved = slideRight();
    } else if (e.code == "ArrowUp" || e.code == "KeyW") {
        moved = slideUp();
    } else if (e.code == "ArrowDown" || e.code == "KeyS") {
        moved = slideDown();
    }

    if (moved) {
        setTwo();
        document.getElementById("score").innerText = score;
        if (!canMove()) {
            gameOver();
        }
    }
})

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    let originalRow = [...row];
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row.toString() !== originalRow.toString() ? row : originalRow;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let newRow = slide(row);
        if (newRow.toString() !== row.toString()) {
            moved = true;
        }
        board[r] = newRow;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        let newRow = slide(row);
        newRow.reverse();
        if (newRow.toString() !== board[r].toString()) {
            moved = true;
        }
        board[r] = newRow;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newRow = slide(row)
        for (let r = 0; r < rows; r++) {
            if (board[r][c] !== newRow[r]) {
                moved = true;
            }
            board[r][c] = newRow[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        let newRow = slide(row)
        newRow.reverse();
        for (let r = 0; r < rows; r++) {
            if (board[r][c] !== newRow[r]) {
                moved = true;
            }
            board[r][c] = newRow[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function gameOver() {
    // Create the overlay
    let overlay = document.createElement("div");
    overlay.id = "game-over-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";

    // Create the game over message
    let message = document.createElement("div");
    message.innerText = "Game Over! Score: " + score;
    message.style.color = "white";
    message.style.fontSize = "2em";
    message.style.marginBottom = "20px";
    overlay.appendChild(message);

    // Create the try again button
    let button = document.createElement("button");
    button.innerText = "Try Again";
    button.style.padding = "10px 20px";
    button.style.fontSize = "1.5em";
    button.style.cursor = "pointer";
    button.onclick = function() {
        location.reload();
    };
    overlay.appendChild(button);

    document.body.appendChild(overlay);
}
