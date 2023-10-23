import { BoardView } from "./dom"
import { Game } from "./modules"

export function initHandler(players) {
  const game = Game()
  const gameboards = document.getElementById(`gameboards`)
  gameboards.style.pointerEvents = "auto" // Re-enable DOM clicks

  const restartGameBtn = document.getElementById(`restartGameBtn`)
  restartGameBtn.addEventListener("click", () => game.start())

  const gameboardComputer = document.getElementById(`gameboardComputer`)
  const computerTiles = gameboardComputer.querySelectorAll(".tile")
  computerTiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      game.playRound(tile, players)
      game.determineWinner(players)
    })
  })
}
