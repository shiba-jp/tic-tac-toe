 
enum GameScene {
    Init = 0,
    PlayerTurn = 1,
    CpuTurn = 2,
    Result = 3,
}

enum Status {
    InAMatch = 0,
    FirstWin = 1,
    SecondWin = 2,
    Draw = 3,
}

let currentScene: GameScene = GameScene.Init
tiles.setTilemap(tilemap`main`)

let cursor = sprites.create(assets.image`cursor`)
let curosrPlaceNo = 0
moveSprite(cursor, curosrPlaceNo)

let statusMap: number[] = []
for(let i = 0; i  < 9; i++) {
    statusMap[i] = 0
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
    if(statusMap[curosrPlaceNo] != 0) return

    let mySprite = sprites.create(isPlayerFirst ? assets.image`batsu` : assets.image`maru`)
    moveSprite(mySprite, curosrPlaceNo)
    statusMap[curosrPlaceNo] = isPlayerFirst ? 1 : 2

    console.log(statusMap)

    cpuTurn()
}

function cpuTurn() {
    currentScene = GameScene.CpuTurn

    let workMap = statusMap.slice(0, statusMap.length - 1)
    let pos: number
    for(let i = 0; i < statusMap.length; i++) {
        if(statusMap[i] != 0) continue

        workMap[i] = isPlayerFirst ? 2 : 1

        let val = minMax(workMap, !isPlayerFirst)

        if(!isPlayerFirst && val == 10) {
            pos = i
            break
        }else if(isPlayerFirst && val == -10) {
            pos = 1
            break
        }
    }

    let mySprite = sprites.create(!isPlayerFirst ? assets.image`batsu` : assets.image`maru`)
    moveSprite(mySprite, pos)
    statusMap[pos] = isPlayerFirst ? 2 : 1

    currentScene = GameScene.PlayerTurn
}

function minMax(workMap: number[], firstMove: boolean) {
    let status: Status = judge(workMap)
    if(status != Status.InAMatch) {
        return evaluate(status, firstMove)
    }else {
        let max: number = -99
        let min: number = 99

        for(let i = 0; i < workMap.length; i++) {
            if(workMap[i] != 0) continue
            workMap[i] = firstMove ? 1 : 2

            let score = minMax(workMap, !firstMove)

            if(firstMove) {
                if(score > max) max = score
            }else{
                if(score < min) min = score
            }
        }

        return firstMove ? max : min
    }
}

function gameOver(win: boolean) {
    game.over(win)
}

function evaluate(status: Status, firstMove: boolean): number {
    if(firstMove && status == Status.FirstWin) {
        return 10
    }else if(firstMove && status == Status.SecondWin) {
        return -10
    }else if(!firstMove && status == Status.FirstWin) {
        return -10
    }else if(!firstMove && status == Status.SecondWin) {
        return 10
    }else{
        return 0
    }
}

function judge(map: number[]): Status{
    if((map[0] == 1 && map[3] == 1 && map[6] == 1)
    || (map[1] == 1 && map[4] == 1 && map[7] == 1)
    || (map[2] == 1 && map[5] == 1 && map[8] == 1)
    || (map[0] == 1 && map[1] == 1 && map[2] == 1)
    || (map[3] == 1 && map[4] == 1 && map[5] == 1)
    || (map[6] == 1 && map[7] == 1 && map[8] == 1)
    || (map[0] == 1 && map[4] == 1 && map[8] == 1)
    || (map[2] == 1 && map[4] == 1 && map[6] == 1)) {
        return Status.FirstWin
    }else if((map[0] == 2 && map[3] == 2 && map[6] == 2)
    || (map[1] == 2 && map[4] == 2 && map[7] == 2)
    || (map[2] == 2 && map[5] == 2 && map[8] == 2)
    || (map[0] == 2 && map[1] == 2 && map[2] == 2)
    || (map[3] == 2 && map[4] == 2 && map[5] == 2)
    || (map[6] == 2 && map[7] == 2 && map[8] == 2)
    || (map[0] == 2 && map[4] == 2 && map[8] == 2)
    || (map[2] == 2 && map[4] == 2 && map[6] == 2)) {
        return Status.SecondWin
    }else if(!map.some(o => o == 0)){
        return Status.Draw
    }else {
        return Status.InAMatch
    }
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