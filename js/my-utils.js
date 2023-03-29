'use strict'

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}


function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function countNegs(rowIdx, colIdx, mat) {
    var negsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			console.log(mat[i][j])
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j].gameElement === BALL ) negsCount++
        }
    }
    return negsCount
}


function findEmptyPos() {                               //להתאים את הפונקציה ליוטיל!!!
	var emptyPoss = []
	console.table(gBoard)

	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			var cell = gBoard[i][j]

			if (cell.type === FLOOR && cell.gameElement === null) {
				var pos = { i, j }
				// console.log(pos)
				// var pos = { i: i, j: j }
				emptyPoss.push(pos)
			}
		}
	}
	// console.log('emptyPoss', emptyPoss)
	var randIdx = getRandomInt(0, emptyPoss.length)
	// console.log('randIdx', randIdx)
	var randPos = emptyPoss[randIdx]
	addBall(randPos)
}



// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {     //להתאים את הפונקציה ליוטיל!!!
	const cellSelector = '.' + getClassName(location)// '.cell-2-7'
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}



function getClassName(position) { // {i:2 , j:5}     //להתאים את הפונקציה ליוטיל!!!
	const cellClass = `cell-${position.i}-${position.j}` // 'cell-2-5'
	return cellClass
}

function renderBoard(board) {

	var strHTML = ''
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n'
		for (var j = 0; j < board[0].length; j++) {
			const currCell = board[i][j]

			var cellClass = getClassName({ i: i, j: j }) // 'cell-3-4'

			if (currCell.type === FLOOR) cellClass += ' floor'
			else if (currCell.type === WALL) cellClass += ' wall'

			strHTML += `\t<td class="cell ${cellClass}" 
							  onclick="moveTo(${i},${j})">`

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG
			}

			strHTML += '</td>\n'
		}
		strHTML += '</tr>\n'
	}
	// console.log('strHTML is:')
	// console.log(strHTML)
	const elBoard = document.querySelector('.board')
	elBoard.innerHTML = strHTML
}



function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

