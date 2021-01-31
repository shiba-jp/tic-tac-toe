 
enum GameScene {
    Init = 0,
    PlayerTurn = 1,
    CpuTurn = 2,
    Result = 3,
}

enum Status {
    InAMatch = 0,
    PlayerWin = 1,
    CpuWin = 2,
}

let currentScene: GameScene = GameScene.Init
tiles.setTilemap(tilemap`main`)

let cursor = sprites.create(assets.image`cursor`)
let curosrPlaceNo = 0
moveSprite(cursor, curosrPlaceNo)

let statusMap: number[] = []
for(let i = 0; i  < 9; i++) {
    statusMap[i] = null
}

let isPlayerFirst = randint(0, 1) == 0 ? true : false
    currentScene = isPlayerFirst ? GameScene.PlayerTurn : GameScene.CpuTurn

if(isPlayerFirst) {
    currentScene = GameScene.PlayerTurn
} else {
    currentScene = GameScene.CpuTurn
    cpuTurn()
}

function playerTurn() {
    if(statusMap[curosrPlaceNo] != null) return

    let mySprite = sprites.create(assets.image`maru`)
    moveSprite(mySprite, curosrPlaceNo)
    statusMap[curosrPlaceNo] = isPlayerFirst ? 0 : 1

    console.log(statusMap)

    cpuTurn()
}

function cpuTurn() {
    currentScene = GameScene.CpuTurn

    pause(1000)

    currentScene = GameScene.PlayerTurn
}

function moveSprite(target: Sprite, place: number) {
    let col = place % 3
    let row = Math.floor(place / 3)
    
    let x = 16 * col + 8
    let y = 16 * row + 8

    target.setPosition(x, y)
    curosrPlaceNo = place
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    if(currentScene == GameScene.PlayerTurn) {
        playerTurn()
    }

    if(currentScene == GameScene.CpuTurn) {
        return
    }
})

controller.up.onEvent(ControllerButtonEvent.Pressed, function() {
    if(currentScene != GameScene.PlayerTurn) return

    if(curosrPlaceNo - 3 < 0) {
        moveSprite(cursor, curosrPlaceNo + 6)
    }else{
        moveSprite(cursor, curosrPlaceNo - 3)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function() {
    if(currentScene != GameScene.PlayerTurn) return

    if(curosrPlaceNo + 3 > 8) {
        moveSprite(cursor, curosrPlaceNo - 6)
    }else{
        moveSprite(cursor, curosrPlaceNo + 3)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function() {
    if(currentScene != GameScene.PlayerTurn) return

    let col = curosrPlaceNo % 3
    if(col - 1 < 0) {
        moveSprite(cursor, curosrPlaceNo + 2)
    }else{
        moveSprite(cursor, curosrPlaceNo - 1)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function() {
    if(currentScene != GameScene.PlayerTurn) return

    let col = curosrPlaceNo % 3
    if(col + 1 > 2) {
        moveSprite(cursor, curosrPlaceNo - 2)
    }else{
        moveSprite(cursor, curosrPlaceNo + 1)
    }
})