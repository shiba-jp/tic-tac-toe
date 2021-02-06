 
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

    pause(300)
    let status = judge(statusMap)
    if(Status.InAMatch == status) {
        cpuTurn()
    }else if(Status.FirstWin == status) {
        game.showLongText(isPlayerFirst ? "Player Win" : "CPU Win", DialogLayout.Bottom)
        game.reset()
    }else if(Status.SecondWin == status) {
        game.showLongText(!isPlayerFirst ? "Player Win" : "CPU Win", DialogLayout.Bottom)
        game.reset()
    }else {
        //Draw
        game.showLongText("Draw", DialogLayout.Bottom)
        game.reset()
    }
}

function cpuTurn() {
    currentScene = GameScene.CpuTurn

    let pos: number = negaMaxNextAction(statusMap, true)

    let mySprite = sprites.create(!isPlayerFirst ? assets.image`batsu` : assets.image`maru`)
    moveCpuSprite(mySprite, pos)
    statusMap[pos] = isPlayerFirst ? 2 : 1

    currentScene = GameScene.PlayerTurn
    
    pause(300)
    let status = judge(statusMap)
    if(Status.InAMatch == status) {
        //
    }else if(Status.FirstWin == status) {
        game.showLongText(isPlayerFirst ? "Player Win" : "CPU Win", DialogLayout.Bottom)
        game.reset()
    }else if(Status.SecondWin == status) {
        game.showLongText(!isPlayerFirst ? "Player Win" : "CPU Win", DialogLayout.Bottom)
        game.reset()
    }else {
        //Draw
        game.showLongText("Draw", DialogLayout.Bottom)
        game.reset()
    }
}


function negaMax(workMap: number[], firstMove: boolean): number {
    let status: Status = judge(workMap)
    if(status != Status.InAMatch) {
        console.logValue(status, workMap)
        return evaluate(status)
    }

    let bestScore: number = -99

    if(isPlayerFirst && !firstMove || !isPlayerFirst && firstMove ) {
        let max: number = -99

        for(let i = 0; i < workMap.length; i++) {
            if(workMap[i] != 0) continue
            workMap[i] = firstMove ? 1 : 2

            let score = negaMax(workMap, !firstMove)
            if(score > max) max = score
        }

        return max
    }else{
        let min: number = 99

        for(let i = 0; i < workMap.length; i++) {
            if(workMap[i] != 0) continue
            workMap[i] = firstMove ? 1 : 2

            let score = negaMax(workMap, !firstMove)
            if(min < score) min = score
        }

        return min
    }
    /**
    for(let i = 0; i < workMap.length; i++) {
        if(workMap[i] != 0) continue
        workMap[i] = firstMove ? 1 : 2

        let score = negaMax(workMap, !firstMove)

        if(firstMove == !isPlayerFirst || !firstMove == isPlayerFirst) {

        }else{

        }

        if(score > bestScore) {
            bestScore = score
        }
    }
    return bestScore
     */
}

function minMax(workMap: number[], flg: boolean): number {
    let status: Status = judge(workMap)
    if(status != Status.InAMatch) {
        console.logValue(status, workMap)
        return evaluate(status)
    }else{
        let value: number
        let child: number

        if(flg) {
            value = -99
        }else{
            value = 99
        }

        for(let i = 0; i < workMap.length; i++) {
            if(workMap[i] != 0) continue

            if(flg && isPlayerFirst) workMap[i] = 2
            if(flg && !isPlayerFirst) workMap[i] = 1
            if(!flg && isPlayerFirst) workMap[i] = 1
            if(!flg && !isPlayerFirst) workMap[i] = 2

            child = minMax(workMap, !flg)

            if(flg) {
                if(child >= value) value = child
            }else {
                if(child <= value) value = child
            }
        }
        return value
    }
}

function negaMaxNextAction(rootMap: number[], flg: boolean): number {
    let scoreList: number[] = []
    let actionList: number[] = []

    for(let i = 0; i < rootMap.length; i++) {
        if(rootMap[i] != 0) continue

        let workMap = rootMap.slice(0, rootMap.length)
        workMap[i] = isPlayerFirst ? 2 : 1

        let score: number = minMax(workMap, !flg)

        scoreList.push(score)
        actionList.push(i)

        if(score >= 0) break
    }

    let actionIndex: number
    for(let i = 0; i < scoreList.length; i++) {
        if(scoreList[i] > 0) {
            actionIndex = i
            break
        }
    }

    return actionList[actionIndex]
}

function gameOver(win: boolean) {

    game.over(win)
}

function evaluate(status: Status): number {
    if(isPlayerFirst && status == Status.FirstWin
     || !isPlayerFirst && status == Status.SecondWin) {
        console.logValue("CPU Eval", -1)
        return -1
    }else if(isPlayerFirst && status == Status.SecondWin
     || !isPlayerFirst && status == Status.FirstWin) {
        console.logValue("CPU Eval", 1)
        return 1
    }else{
        console.logValue("CPU Eval", 0)
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

function moveCpuSprite(target: Sprite, place: number) {
    let col = place % 3
    let row = Math.floor(place / 3)
    
    let x = 16 * col + 8
    let y = 16 * row + 8

    target.setPosition(x, y)
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