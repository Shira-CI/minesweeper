'use strict'
const FLAG = '🚩'
const MINE = '💣'
var gBoard
var gElCell
var gIntervalId

var gLevel = {
    size: 4,
    mines: 0
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesCount: 0
}




function timer() {
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    var totalSeconds = 0;
    gIntervalId =  setInterval(setTime, 1000);

    function setTime() {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        }
        else {
            return valString;
        }
    }

}


function restartGame() {

    var elBtn = document.querySelector('.restart')
    elBtn.innerText = '😋'
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.minesCount = 0
    onInit()
}


function diffChoose(size) {
    gLevel.size = size
    restartGame()

}


function onInit() {
    gGame.isOn = true
    gBoard = buildBoard(gLevel.size)
    // console.log(gBoard)
    renderBoard(gBoard)
    rightClick()
}


function buildBoard(size) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}


function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            // const currCell = board[i][j]
            // var minesAroundCount = currCell.minesAroundCount
            var cellClass = getClassName({ i: i, j: j }) // 'cell-3-4'

            // if (currCell.isMine === true) cellClass += ' bomb'
            // else cellClass += ' notBomb'

            strHTML += `\t<td class="cell ${cellClass}" oncontextmenu="checkMouse(event,this,${i},${j})" onclick =checkMouse(event,this,${i},${j}) ">`

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log(gBoard)
}


function onCellClicked(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    if (gGame.isOn === false) return
    if (gGame.shownCount === 0) {
        firstClick(elCell, cellI, cellJ)           //first click option
    } else {
        if (currCell.isMarked) return
        if (currCell.isShown) return

        if (currCell.isMine) {                        //if a mine
            elCell.style.backgroundColor = 'red'
            elCell.innerText = MINE
            gameOver(cellI, cellJ)
        } else {                                     //if an coverd cell
            elCell.classList.add('reveal')
            currCell.isShown = true
            gGame.shownCount++
            elCell.innerText = currCell.minesAroundCount

            if (currCell.minesAroundCount === 0) {
                elCell.innerText = ''
            } else {
                revealNegs(cellI, cellJ)
            }
            checkGameOver()
        }
    }
}


function firstClick(elCell, cellI, cellJ) {
    gGame.shownCount++
    gBoard[cellI][cellJ].isShown = true
    timer()

    var negsPossi = negsPoss(cellI, cellJ)

    for (var n = 0; n < negsPossi.length; n++) {
        var currPoss = negsPossi[n]

        gBoard[currPoss.i][currPoss.j].minesAroundCount = 10
        gBoard[cellI][cellJ].minesAroundCount = 'current'
        // console.table(gBoard)
        // gBoard[cellI][cellJ].isShown = true
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].minesAroundCount === 10 || gBoard[i][j].minesAroundCount === 'current') continue
            else {
                if (Math.random() > 0.5) {
                    gBoard[i][j].isMine = true
                    gGame.minesCount++
                }
            }
        }
    }
    setMinesNegsCount(elCell, cellI, cellJ)
}


function onCellMarked(elCell, cellI, cellJ) {                     //לחיצה על כפתור ימין
    var currCell = gBoard[cellI][cellJ]
    if (currCell.isShown) return
    else {
        if (!currCell.isMarked) {
            elCell.innerText = FLAG
            currCell.isMarked = true
            gGame.markedCount++
        } else {
            elCell.innerText = ''
            currCell.isMarked = false
            gGame.markedCount--

        }
    }
}


//////////////////


function setMinesNegsCount(elCell, cellI, cellJ) {
    elCell.classList.add('reveal')
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) continue

            var minesAroundCount = countNegs(i, j, gBoard)
            currCell.minesAroundCount = minesAroundCount
        }
    }
    revealNegs(cellI, cellJ)
    return
}


function revealNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            if (currCell.isMarked) continue
            if (currCell.isShown) continue
            if (currCell.isMine) continue

            var position = { i, j }
            var cellClassName = getClassName(position)
            cellClassName = '.' + cellClassName
            var elCellNeg = document.querySelector(cellClassName)
            // gBoard[rowIdx][colIdx].minesAroundCount = ''

            if (currCell.minesAroundCount === 0) currCell.minesAroundCount = ''
            elCellNeg.innerText = currCell.minesAroundCount
            elCellNeg.classList.add('reveal')
            currCell.isShown = true
            gGame.shownCount++
        }
    }
}


function negsPoss(rowIdx, colIdx) {
    var negsPoss = []

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            var position = { i: i, j: j }
            // console.log(i , 'i' , j ,  'j')
            negsPoss.push(position)
            // console.log('negsPoss', negsPoss)
        }
    }
    // console.log(rowIdx , colIdx , 'negsCount' , negsCount)
    return negsPoss
}


///////////////////


function checkGameOver() {
    if (gGame.minesCount === (gLevel.size * gLevel.size) - gGame.shownCount && gGame.markedCount === gGame.minesCount) {
        gGame.isOn = false
        var elBtn = document.querySelector('.restart')
        elBtn.innerText = '🤑'
    }
    clearInterval(gIntervalId)

}


function gameOver(cellI, cellJ) {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell === gBoard[cellI][cellJ]) continue
            if (currCell.isMine) mines.push({ i, j })
        }
    }
    for (var i = 0; i < mines.length; i++) {
        var currClass = getClassName(mines[i])
        currClass = '.' + currClass
        var elCell = document.querySelector(currClass)
        elCell.innerText = MINE
        elCell.classList.add('reveal')
    }
    var elBtn = document.querySelector('.restart')
    elBtn.innerText = '🙄'
    gGame.isOn = false
    clearInterval(gIntervalId)
}

/////////////////////

function countNegs(rowIdx, colIdx, board) {
    var negsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine === true) negsCount++
        }
    }
    // console.log(rowIdx , colIdx , 'negsCount' , negsCount)
    return negsCount
}


function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}

function checkMouse(event, elCell, cellI, cellJ) {
    timer()

    if (gGame.isOn === false) return
    if (event.button === 0) onCellClicked(elCell, cellI, cellJ)
    // console.log(event)
    if (event.button === 2) onCellMarked(elCell, cellI, cellJ)
}


function rightClick() {           //הפונקציה שבכללי מבטלת לחיצה על ימין
    var elCells = document.querySelectorAll('.cell')
    // console.log(elCells)
    for (var i = 0; i < elCells.length; i++) {
        // console.log(elCells[i]) 
        elCells[i].addEventListener('contextmenu', (event) => {
            event.preventDefault();
        })
    }
}