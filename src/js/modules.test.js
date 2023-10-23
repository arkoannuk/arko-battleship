import { Ship, Gameboard, Player } from "./modules"

describe("Ship", () => {
  let destroyer

  beforeEach(() => {
    destroyer = Ship("Destroyer", 2)
  })

  test("should hit the ship and increase hits", () => {
    destroyer.hit()
    expect(destroyer.isSunk()).toEqual(false)
  })

  test("should hit the ship twice and sink it", () => {
    destroyer.hit()
    destroyer.hit()
    expect(destroyer.isSunk()).toEqual(true)
  })

  test("should not exceed the number of hits beyond ship", () => {
    destroyer.hit()
    destroyer.hit()
    destroyer.hit()
    expect(destroyer.isSunk()).toEqual(true)
  })
})

describe("Gameboard 'placeShip'", () => {
  let battleship
  let gameboard

  beforeEach(() => {
    battleship = Ship("Battleship", 4)
    gameboard = Gameboard()
  })

  test("should have tiles", () => {
    expect(gameboard.tiles).toBeInstanceOf(Array)
  })

  test("should allow vertical ship placement", () => {
    gameboard.placeShip(battleship, 0, 3, "Vertical")
    expect(gameboard.tiles[0][3]).toEqual(battleship.name)
    expect(gameboard.tiles[1][3]).toEqual(battleship.name)
    expect(gameboard.tiles[2][3]).toEqual(battleship.name)
    expect(gameboard.tiles[3][3]).toEqual(battleship.name)
    expect(gameboard.tiles[4][3]).toEqual(" ")
  })

  test("should allow horizontal ship placement", () => {
    gameboard.placeShip(battleship, 0, 3, "Horizontal")
    expect(gameboard.tiles[0][3]).toEqual(battleship.name)
    expect(gameboard.tiles[0][4]).toEqual(battleship.name)
    expect(gameboard.tiles[0][5]).toEqual(battleship.name)
    expect(gameboard.tiles[0][6]).toEqual(battleship.name)
    expect(gameboard.tiles[0][7]).toEqual(" ")
  })
})

describe("Gameboard 'receiveAttack'", () => {
  let battleship
  let destroyer
  let gameboard

  beforeEach(() => {
    battleship = Ship("Battleship", 4)
    destroyer = Ship("Destroyer", 2)
    gameboard = Gameboard()
  })

  test("should mark missed hit if tile w/o ship marked", () => {
    gameboard.receiveAttack(0, 3)
    expect(gameboard.tiles[0][3]).toEqual("X")
    gameboard.receiveAttack(0, 3)
    expect(gameboard.tiles[0][3]).toEqual("X")
  })

  test("should mark tile and hit ship if tile w/ ship marked", () => {
    gameboard.placeShip(battleship, 0, 3, "Vertical")
    gameboard.receiveAttack(0, 3)
    gameboard.receiveAttack(0, 3)
    expect(gameboard.tiles[0][3]).toEqual("Battleship hit")
    expect(battleship.isSunk()).toEqual(false)
    gameboard.receiveAttack(1, 3)
    gameboard.receiveAttack(2, 3)
    gameboard.receiveAttack(3, 3)
    expect(battleship.isSunk()).toEqual(true)
  })

  test("should mark tile as empty if tile w/o ship marked", () => {
    expect(gameboard.tiles[0][3]).toEqual(" ")
    gameboard.receiveAttack(0, 3)
    expect(gameboard.tiles[0][3]).toEqual("X")
  })

  test("should report whether or not all placed sinks have been sunk", () => {
    gameboard.placeShip(battleship, 0, 3, "Vertical")
    gameboard.placeShip(destroyer, 5, 5, "Horizontal")

    gameboard.receiveAttack(0, 3)
    gameboard.receiveAttack(0, 3)
    gameboard.receiveAttack(1, 3)
    gameboard.receiveAttack(2, 3)
    gameboard.receiveAttack(3, 3)

    gameboard.receiveAttack(5, 5)
    expect(gameboard.allSunk()).toEqual(false)
    gameboard.receiveAttack(5, 6)
    expect(gameboard.allSunk()).toEqual(true)
  })
})

describe("Player", () => {
  let gameboard
  let player1
  let player2
  let battleship

  beforeEach(() => {
    gameboard = Gameboard()
    player1 = Player("Person", gameboard)
    player2 = Player("Computer", gameboard)
    battleship = Ship("Battleship", 4)
  })

  test("should have a gameboard", () => {
    expect(player1.gameboard).toBeTruthy()
  })

  test("should be able to place ships on their own gameboard", () => {
    player1.gameboard.placeShip(battleship, 0, 3, "Vertical")
    expect(player1.gameboard.ships[0]).toEqual(battleship)
  })

  // test("should be able to attack other players gameboard", () => {
  //   player1.gameboard.placeShip(battleship, 0, 3, "Vertical")
  //   player2.attack(0, 3, player1)
  //   expect(player1.gameboard.tiles[0][3]).toEqual("Battleship hit")
  // })
})
