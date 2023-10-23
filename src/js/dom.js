export const BoardView = () => {
  const createBoard = (player) => {
    const gameboardTable = document.getElementById(`gameboard${player.name}`)

    for (let i = 0; i < 10; i++) {
      const row = document.createElement("div")
      row.classList.add("row", "m-0", "p-0")
      for (let j = 0; j < 10; j++) {
        const tile = document.createElement("div")
        tile.classList.add(
          "col",
          "border",
          "border-black",
          "p-0",
          "m-0",
          "text-center",
          "tile"
        )
        tile.dataset.row = i
        tile.dataset.col = j
        tile.textContent = "" // Initial state
        row.appendChild(tile)
      }
      gameboardTable.appendChild(row)
    }
  }

  const showBoard = (player) => {
    const gameboardTable = document.getElementById(`gameboard${player.name}`)

    const tileDivs = gameboardTable.querySelectorAll(".col[data-row][data-col]")
    tileDivs.forEach((tile) => {
      const row = tile.dataset.row
      const col = tile.dataset.col
      const tileText = player.gameboard.tiles[row][col]
      tile.textContent = tileText.slice(0, 2)
    })
  }

  const updateTile = (player, row, col) => {
    const gameboardTable = document.getElementById(`gameboard${player.name}`)
    var selector = `[data-row="${row}"][data-col="${col}"]`
    var tile = gameboardTable.querySelector(selector)
    const tileText = player.gameboard.tiles[row][col]

    if (tileText.includes("hit")) {
      tile.textContent = tileText.slice(0, 2)
      tile.classList.add("bg-danger")
    } else {
      tile.classList.add("bg-secondary")
    }
  }

  const announceWinner = (player) => {
    const winnerText = document.getElementById(`winnerText`)
    if (player === "Computer") {
      winnerText.textContent = `${player} has won the game!`
    } else {
      winnerText.textContent = "You have won the game!"
    }

    const gameboards = document.getElementById(`gameboards`)
    gameboards.style.pointerEvents = "none" // Disable DOM clicks
  }

  const clearGame = () => {
    const element = document.getElementById(`gameboardPerson`)
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }

    const element1 = document.getElementById(`gameboardComputer`)
    while (element1.firstChild) {
      element1.removeChild(element1.firstChild)
    }

    const winnerText = document.getElementById(`winnerText`)
    winnerText.textContent = "Sink the Computer's fleets!"

    const restartGameBtn = document.getElementById("restartGameBtn")
    const newRestartGameBtn = restartGameBtn.cloneNode(true)
    restartGameBtn.parentNode.replaceChild(newRestartGameBtn, restartGameBtn)
  }

  return {
    createBoard,
    showBoard,
    updateTile,
    clearGame,
    announceWinner,
  }
}
