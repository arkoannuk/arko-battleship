import { BoardView } from "./dom"
import { initHandler } from "./handler"

export const Ship = (name, shipLength) => {
  let hits = 0
  const hit = () => {
    if (hits < shipLength) {
      hits++
    }
  }
  const isSunk = () => {
    return hits === shipLength
  }

  return {
    hit,
    isSunk,
    name,
    shipLength,
  }
}

export const Gameboard = () => {
  const tiles = []
  const ships = []

  for (let i = 0; i < 10; i++) {
    const row = []
    for (let j = 0; j < 10; j++) {
      row.push(" ")
    }
    tiles.push(row)
  }

  const placeShip = (ship, row, col, direction) => {
    if (direction === "Vertical") {
      for (let i = 0; i < ship.shipLength; i++) {
        tiles[row + i][col] = ship.name
      }
    } else if (direction === "Horizontal") {
      for (let i = 0; i < ship.shipLength; i++) {
        tiles[row][col + i] = ship.name
      }
    } else {
      console.error("Direction unspecified")
    }
    ships.push(ship)
  }

  const receiveAttack = (row, col) => {
    const tile = tiles[row][col]

    if (tile === " ") {
      tiles[row][col] = "X"
    } else if (tile !== "X") {
      const ship = ships.find((s) => s.name === tile)
      if (ship) {
        ship.hit()
        tiles[row][col] = tile + " hit"
      }
    }
  }

  const allSunk = () => {
    return ships.every((ship) => ship.isSunk())
  }

  return {
    tiles,
    placeShip,
    receiveAttack,
    allSunk,
    ships,
  }
}

export const Player = (name, gameboard) => {
  const usedCombinations = new Set()
  const totalCombinations = 10 * 10

  const randomAttack = (player) => {
    if (usedCombinations.size >= totalCombinations) {
      return
    }

    let tileRow, tileCol, combination

    do {
      tileRow = Math.floor(Math.random() * 10)
      tileCol = Math.floor(Math.random() * 10)
      combination = [tileRow, tileCol].join("")
    } while (usedCombinations.has(combination))

    usedCombinations.add(combination)
    player.gameboard.receiveAttack(tileRow, tileCol)

    return {
      tileRow,
      tileCol,
    }
  }

  const randomShipPlace = (ship) => {
    let [tileRow, tileCol, direction] = getRandomAvailTile(
      gameboard.tiles,
      ship.shipLength
    )

    gameboard.placeShip(ship, tileRow, tileCol, direction)

    function getRandomAvailTile(tiles, shipLength) {
      let tileRow, tileCol, direction

      do {
        direction = Math.random() < 0.5 ? "Vertical" : "Horizontal"
        tileRow = Math.floor(Math.random() * 10)
        tileCol = Math.floor(Math.random() * 10)
      } while (
        checkFit(shipLength, direction, tileRow, tileCol, tiles) === false
      )
      return [tileRow, tileCol, direction]
    }

    function checkFit(shipLength, direction, tileRow, tileCol, tiles) {
      let fit = true

      if (direction === "Vertical") {
        for (let x = 0; x < shipLength; x++) {
          if (tileRow + x > 9 || tiles[tileRow + x][tileCol] !== " ") {
            fit = false
            break
          }
        }
        return fit
      }

      if (direction === "Horizontal") {
        for (let x = 0; x < shipLength; x++) {
          if (tileCol + x > 9 || tiles[tileRow][tileCol + x] !== " ") {
            fit = false
            break
          }
        }
        return fit
      }
    }
  }

  return {
    randomShipPlace,
    randomAttack,
    name,
    gameboard,
  }
}

export const Game = () => {
  let players = []
  const boardView = BoardView()
  const gameboard1 = Gameboard()
  const gameboard2 = Gameboard()

  const player1 = Player("Person", gameboard1)
  const player2 = Player("Computer", gameboard2)

  const carrier1 = Ship("🚢", 5)
  const carrier2 = Ship("🚢", 5)

  const battleship1 = Ship("🛥", 4)
  const battleship2 = Ship("🛥", 4)

  const cruiser1 = Ship("⛵", 3)
  const cruiser2 = Ship("⛵", 3)

  const submarine1 = Ship("🚤", 3)
  const submarine2 = Ship("🚤", 3)

  const destroyer1 = Ship("🛶", 2)
  const destroyer2 = Ship("🛶", 2)

  const start = () => {
    if (players) {
      boardView.clearGame()
      players = []
    }

    players.push(player1)
    players.push(player2)

    players[0].randomShipPlace(carrier1)
    players[0].randomShipPlace(battleship1)
    players[0].randomShipPlace(cruiser1)
    players[0].randomShipPlace(submarine1)
    players[0].randomShipPlace(destroyer1)

    players[1].randomShipPlace(carrier2)
    players[1].randomShipPlace(battleship2)
    players[1].randomShipPlace(cruiser2)
    players[1].randomShipPlace(submarine2)
    players[1].randomShipPlace(destroyer2)

    boardView.createBoard(players[0])
    boardView.createBoard(players[1])

    boardView.showBoard(players[0])
    // boardView.showBoard(players[1]) // Enable to see enemy board
    initHandler(players)
  }

  const playRound = (tile, players) => {
    const tileRow = tile.getAttribute("data-row")
    const tileCol = tile.getAttribute("data-col")

    if (tile.textContent === "" && !tile.classList.contains("bg-secondary")) {
      players[1].gameboard.receiveAttack(tileRow, tileCol)
      BoardView().updateTile(players[1], tileRow, tileCol)

      setTimeout(function () {
        const computerAttack = players[1].randomAttack(players[0])
        if (computerAttack) {
          const { tileRow, tileCol } = computerAttack
          BoardView().updateTile(players[0], tileRow, tileCol)
        }
      }, 300)
    }
  }

  const determineWinner = (players) => {
    if (players[1].gameboard.allSunk()) {
      BoardView().announceWinner(players[0].name)
    } else if (players[0].gameboard.allSunk()) {
      BoardView().announceWinner(players[1].name)
    }
  }

  return {
    players,
    start,
    playRound,
    determineWinner,
  }
}
