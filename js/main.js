'use strict'
const FLAG = '🚩'
const MINE = '💣'
var gBoard
var gElCell

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = buildBoard(4)
    console.log(gBoard)
    renderBoard(gBoard)
    onCellMarked()
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
            // if (Math.random() > 0.7) board[i][j].isMine = true
        }
    }

    board[0][3].isMine = true
    board[3][1].isMine = true
    // console.log('board[3][1]', board[3][1])
    // console.log('board[0][3]', board[0][3])

    var res = setMinesNegsCount(board)
    // console.log('setMinesNegsCount', res)


    return board
}


function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var minesAroundCount = currCell.minesAroundCount
            var cellClass = getClassName({ i: i, j: j }) // 'cell-3-4'

            if (currCell.isMine === true) cellClass += ' bomb'
            else cellClass += ' notBomb'

            strHTML += `\t<td class="cell ${cellClass}" oncontextmenu="checkMouse(event,this,${i},${j})" onclick =checkMouse(event,this,${i},${j}) ">`

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML


}



function checkMouse(event, elCell, cellI, cellJ) {
    if (event.button === 0) onCellClicked(elCell, cellI, cellJ)
    console.log(event)
    if (event.button === 2) onCellMarked2(elCell, cellI, cellJ)
}



function onCellClicked(elCell, cellI, cellJ) {            //לחיצה על כפתור שמאל
    console.log(elCell)
    var currCell = gBoard[cellI][cellJ]
    if (currCell.isMarked) return
    if (!currCell.isMine) {
        // console.log('currCell' , currCell)
        elCell.classList.add('reveal')
        currCell.isShown = true
        // console.log('after' , currCell)
        if (currCell.minesAroundCount !== 0) {
            elCell.innerText = currCell.minesAroundCount
            currCell.isShown = true
        }
    } else {
        elCell.innerText = MINE
        currCell.isShown = true
        currCell.isMine = true
        elCell.classList.add('reveal')
    }
}


function onCellMarked() {           //הפונקציה שבכללי מבטלת לחיצה על ימין
    var elCells = document.querySelectorAll('.cell')
    // console.log(elCells)
    for (var i = 0; i < elCells.length; i++) {
        // console.log(elCells[i]) 
        elCells[i].addEventListener('contextmenu', (event) => {
            event.preventDefault();
        })
    }
}



function onCellMarked2(elCell, cellI, cellJ) {                //לחיצה על כפתור ימין
    // var elCells = document.querySelectorAll('.cell')
    // console.log(elCells)
    // for (var i = 0; i < elCells.length; i++) {
    // console.log(elCells[i]) 
    var currCell = gBoard[cellI][cellJ]
    if (currCell.isShown) return

    else {
        if (!currCell.isMarked) {
            elCell.innerText = FLAG
            currCell.isMarked = true
        } else {

            elCell.innerText = ''
            currCell.isMarked = false
        }
    }
}



function setMinesNegsCount(board) {
    var minesAroundCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) continue
            minesAroundCount = countNegs(i, j, board)
            currCell.minesAroundCount = minesAroundCount
        }
    }
    return minesAroundCount
}


function getClassName(position) { // {i:2 , j:5}
    const cellClass = `cell-${position.i}-${position.j}` // 'cell-2-5'
    return cellClass
}


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