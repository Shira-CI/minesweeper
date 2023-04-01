'use strict'
const FLAG = '🚩'
const MINE = '💣'
var gBoard
var gElCell
var gIntervalId
var gIntervalIdHint
var gTime = 0
var gLive = 3
var gHint = false
var gElHint
var gLightMode = true


var gLevel = {
    size: 4,
    mines: 0
}


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesCount: 0,
    hints: 3,
    safes: 3
}


function shownCounter() {
    var shownCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShown) shownCount++
        }

    }
    gGame.shownCount = shownCount

}


function safeCell() {
    if (gGame.safes === 0) return
    if (gGame.isOn === false) return

    gGame.safes--
    var safesClicks = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown && !currCell.isClicked) {
                // console.log('options', currCell)
                safesClicks.push({ i, j })
            }
        }
    }
    // console.log('options array' , safesClicks)
    if (safesClicks.length === 0) return

    var randIdx = getRandomInt(0, safesClicks.length)
    var safeCell = safesClicks[randIdx]
    // console.log(safeCell)
    var cellClass = `.cell-${safeCell.i}-${safeCell.j}`
    // console.log(cellClass)
    var elCellClass = document.querySelector(cellClass)

    elCellClass.classList.add('reveal')
    var currSafeCell = gBoard[safeCell.i][safeCell.j]
    elCellClass.innerText = currSafeCell.minesAroundCount
    if (currSafeCell.minesAroundCount === 0) elCellClass.innerText = ''

    // console.log('mines around' , gBoard[safeCell.i][safeCell.j].minesAroundCount)

    setTimeout(stopSafeCell, 1000, elCellClass)
}


function stopSafeCell(elCellClass) {
    elCellClass.classList.remove('reveal')
    elCellClass.innerText = ''
    var elSafeCount = document.querySelector('.safeBtn span')
    // console.log(elHintCount)
    elSafeCount.innerText = gGame.safes
}


function bodyMode() {
    if (gLightMode) {
        var elBody = document.querySelector('.body')
        elBody.classList.add('bodyDark')

        var elRestartBtn = document.querySelector('.restart')
        elRestartBtn.classList.add('restartDark')

        var elHintBtn = document.querySelector('.hint')
        elHintBtn.classList.add('hintDark')

        var elH2 = document.querySelector('h2')
        elH2.classList.add('h2Dark')

        var elBtnMode = document.querySelector('.btnMode')
        elBtnMode.classList.add('btnDark')
        elBtnMode.innerText = 'light mode'

        var elFooter = document.querySelector('.footer')
        elFooter.classList.add('footerDark')

        gLightMode = false

    } else {
        var elBody = document.querySelector('.body')
        elBody.classList.remove('bodyDark')

        var elRestartBtn = document.querySelector('.restart')
        elRestartBtn.classList.remove('restartDark')

        var elHintBtn = document.querySelector('.hint')
        elHintBtn.classList.remove('hintDark')

        var elH2 = document.querySelector('h2')
        elH2.classList.remove('h2Dark')

        var elBtnMode = document.querySelector('.btnMode')
        elBtnMode.classList.remove('btnDark')
        elBtnMode.innerText = 'dark mode'

        var elFooter = document.querySelector('.footer')
        elFooter.classList.remove('footerDark')

        gLightMode = true
    }
}


function hintClick(element) {
    gElHint = element
    if (gGame.hints === 0) return
    if (gGame.isOn === false) return

    gGame.hints--
    // console.log(gGame.hints)
    alert('now choose a cell')
    element.style.backgroundColor = 'yellow'
    gHint = true
}


function getHint(rowIdx, colIdx) {
    gHint = false
    var negsClass = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            var currNegCell = gBoard[i][j]
            if (currNegCell.isShown) continue
            var position = { i, j }
            var cellClassName = getClassName(position)
            cellClassName = '.' + cellClassName
            negsClass.push(cellClassName)
            // console.log('cellClassName' , cellClassName)
            var elCellNeg = document.querySelector(cellClassName)
            elCellNeg.classList.add('reveal')
            if (currNegCell.isMine) {
                elCellNeg.innerText = MINE
            }

            else if (currNegCell.minesAroundCount === 0) currNegCell.minesAroundCount = ''
            else elCellNeg.innerText = currNegCell.minesAroundCount
        }
    }
    gIntervalIdHint = setInterval(hintCancel, 1000, negsClass)
}


function hintCancel(negsClass) {
    for (var i = 0; i < negsClass.length; i++) {
        var elCellNeg = document.querySelector(negsClass[i])
        // console.log(elCellNeg)
        elCellNeg.innerText = ''
        elCellNeg.classList.remove('reveal')
        clearInterval(gIntervalIdHint)
    }
    gElHint.style.backgroundColor = 'white'
    hintRestart()
}


function hintRestart() {
    var elHintCount = document.querySelector('.hint span')
    // console.log(elHintCount)
    elHintCount.innerText = gGame.hints
}


function clearTimer() {
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    secondsLabel.innerHTML = '00'
    minutesLabel.innerHTML = '00'
}

function timer() {
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    // gGame.secsPassed = 0;
    gIntervalId = setInterval(setTime, 1000);

    function setTime() {
        ++gGame.secsPassed;
        secondsLabel.innerHTML = pad(gGame.secsPassed % 60);
        minutesLabel.innerHTML = pad(parseInt(gGame.secsPassed / 60));
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


function lives() {
    var elLives = document.querySelector('.lives')
    elLives.innerText = '❤❤❤'
    if (gLive === 2) elLives.innerText = '❤❤'
    if (gLive === 1) elLives.innerText = '❤'
    if (gLive === 0) elLives.innerText = ''

}


function restartGame() {
    var elBtn = document.querySelector('.restart')
    elBtn.innerText = '😋'
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.minesCount = 0
    gGame.hints = 3
    gGame.safes = 3


    gTime = 0
    gLive = 3
    gHint = false
    onInit()
    clearInterval(gIntervalId)
    clearTimer()
    hintRestart()
    var elSafeCount = document.querySelector('.safeBtn span')
    // console.log(elHintCount)
    elSafeCount.innerText = gGame.safes
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
    lives()
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
                isMarked: false,
                isClicked: false
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
            var cellClass = getClassName({ i: i, j: j }) // 'cell-3-4'
            strHTML += `\t<td class="cell ${cellClass}" oncontextmenu="checkMouse(event,this,${i},${j})" onclick =checkMouse(event,this,${i},${j}) ">`
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log(gBoard)
}


function emptyNgsReaveal(idxI, idxJ) {
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === idxI && j === idxJ) continue
            var currCell = gBoard[i][j]
            var cellClass = `.cell-${i}-${j}`
            var currElCell = document.querySelector(cellClass)

            var iAbsDiff = Math.abs(idxI - i)
            var jAbsDiff = Math.abs(idxJ - j)
            if ((iAbsDiff === 1) && (jAbsDiff === 1)) continue
            if (currCell.isMarked || currCell.isMine || (currCell.isShown)) continue


            currElCell.classList.add('reveal')
            currCell.isShown = true

            if (currCell.minesAroundCount === 0) {
                currCell.minesAroundCount = ''
                emptyNgsReaveal(i, j)
            }
            currElCell.innerText = currCell.minesAroundCount
        }
    }
}


function onCellClicked(elCell, cellI, cellJ) {
    if (gHint === true) {
        getHint(cellI, cellJ)
        return
    }

    var currCell = gBoard[cellI][cellJ]
    // console.log(currCell)
    if (currCell.isClicked === true) return
    if (!currCell.isMarked) currCell.isClicked = true
    if (gGame.isOn === false) return
    if (gGame.shownCount === 0) {
        firstClick(elCell, cellI, cellJ)           //first click option
    } else {
        if (currCell.isMarked) return
        if (currCell.isShown) return

        if (currCell.isMine) {
            elCell.innerText = MINE
            gLive--
            // console.log(gLive)
            lives()
            checkGameOver(elCell, cellI, cellJ)
        } else {                                     //if an coverd cell
            elCell.classList.add('reveal')
            currCell.isShown = true
            shownCounter()
            elCell.innerText = currCell.minesAroundCount
            if (currCell.minesAroundCount === 0) {
                elCell.innerText = ''
                // revealNegs(cellI, cellJ)
                emptyNgsReaveal(cellI, cellJ)
            }
            checkVictory()
        }
    }
}


function firstClick(elCell, cellI, cellJ) {
    shownCounter()
    gBoard[cellI][cellJ].isShown = true

    var negsPossi = negsPoss(cellI, cellJ)

    for (var n = 0; n < negsPossi.length; n++) {
        var currPoss = negsPossi[n]

        gBoard[currPoss.i][currPoss.j].minesAroundCount = 10
        gBoard[cellI][cellJ].minesAroundCount = 'current'
        // console.table(gBoard)
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].minesAroundCount === 10 || gBoard[i][j].minesAroundCount === 'current') continue
            else {
                if (Math.random() > 0.7) {
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

            if (currCell.minesAroundCount === 0) {
                currCell.minesAroundCount = ''
                emptyNgsReaveal(i , j)

            }
            elCellNeg.innerText = currCell.minesAroundCount
            elCellNeg.classList.add('reveal')
            currCell.isShown = true
            shownCounter()
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


function checkVictory() {
    if (gGame.minesCount === (gLevel.size * gLevel.size) - gGame.shownCount) {
        gGame.isOn = false
        var elBtn = document.querySelector('.restart')
        elBtn.innerText = '🤑'
        clearInterval(gIntervalId)
    }
}


function checkGameOver(elCell, cellI, cellJ) {
    if (gLive != 0) return
    elCell.style.backgroundColor = 'red'
    clearInterval(gIntervalId)
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
        var elCurrCell = document.querySelector(currClass)
        elCurrCell.innerText = MINE
        elCurrCell.classList.add('reveal')
    }
    gGame.isOn = false
    // console.log(gGame.isOn)
    var elBtn = document.querySelector('.restart')
    elBtn.innerText = '🙄'
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


function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}


function checkMouse(event, elCell, cellI, cellJ) {
    if (gTime === 0) {
        timer()
        gTime++
    }
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


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}