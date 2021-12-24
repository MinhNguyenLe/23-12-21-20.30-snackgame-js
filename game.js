const canvas = document.getElementById("myCanvas");
const drawer = canvas.getContext("2d");

const rectUnit = 20
const widthUnit = rectUnit, heightUnit = rectUnit
const heightText = rectUnit
const timer = 100
let score = 0
let state = {
  loop: "running",
  direction: 'r', // l : left r: right t: top b: bottom
}

const scoreEle = document.getElementById('score')

class Unit {
  constructor(state) {
    this.x = state.x;
    this.y = state.y;
    this.width = state.width || widthUnit;
    this.height = state.height || heightText;
    if (state.special) this.special = { ...state.special }
    this.init()
  }
  init() {
    this.draw()
  }
  draw() {
    if (this.special) {
      if (this.special.color) drawer.fillStyle = this.special.color;
    }
    else drawer.fillStyle = "white";
    drawer.fillRect(this.x, this.y, this.width, this.height)
  }
}
class Snack {
  constructor(arrUnit) {
    this.arrUnit = arrUnit
    this.init()
  }
  defaultArrUnit() {
    this.arrUnit = [
      { x: widthUnit * 3, y: heightUnit * 2, special: { color: "blue" } },
      { x: widthUnit * 2, y: heightUnit * 2 },
      { x: widthUnit * 1, y: heightUnit * 2 },
    ]
  }
  getArrUnit() {
    return this.arrUnit
  }
  init() {
    if (!this.arrUnit.length) {
      this.defaultArrUnit()
    }
    this.draw()
  }
  draw() {
    this.arrUnit.forEach(unit => {
      new Unit(unit)
    })
  }
  eat(location) {
    console.log(location, "....", this.arrUnit[0].x, this.arrUnit[0].y);
    [...this.arrUnit].forEach((unit, index, arr) => {
      if (location.x === unit.x && location.y === unit.y) {
        apple.update()
        this.upgrade()
        score++
        scoreEle.textContent = score;
        arr.length = 0
      }
    })
  }
  upgrade() {
    const oldUnit = this.arrUnit[0]
    if (state.direction === 'r') {
      this.uploadLocationLead(oldUnit.x + widthUnit, oldUnit.y)
    } else if (state.direction === 'l') {
      this.uploadLocationLead(oldUnit.x - widthUnit, oldUnit.y)
    } else if (state.direction === 't') {
      this.uploadLocationLead(oldUnit.x, oldUnit.y - heightUnit)
    } else if (state.direction === 'b') {
      this.uploadLocationLead(oldUnit.x, oldUnit.y + heightUnit)
    }
  }
  uploadLocationLead(x, y) {
    this.arrUnit.unshift({
      x: x,
      y: y,
      special: { color: "blue" }
    })
    this.arrUnit[1].special = undefined
  }
  move() {
    const old = this.arrUnit.pop()
    old["special"] = {}
    old["special"]["color"] = 'black'
    new Unit(old)

    const oldUnit = this.arrUnit[0]

    if (state.direction === 'r') {
      this.uploadLocationLead(oldUnit.x + widthUnit, oldUnit.y)
    } else if (state.direction === 'l') {
      this.uploadLocationLead(oldUnit.x - widthUnit, oldUnit.y)
    } else if (state.direction === 't') {
      this.uploadLocationLead(oldUnit.x, oldUnit.y - heightUnit)
    } else if (state.direction === 'b') {
      this.uploadLocationLead(oldUnit.x, oldUnit.y + heightUnit)
    }
    this.draw()
  }
}
class Apple {
  constructor(snack) {
    this.snack = snack
    this.init()
  }
  init() {
    let done = false
    while (!done) {
      done = true
      this.x = Math.floor(Math.random() * (canvas.width / rectUnit)) * rectUnit || rectUnit
      this.y = Math.floor(Math.random() * (canvas.height / rectUnit)) * rectUnit || rectUnit

      this.snack.forEach(unit => {
        if (this.x === unit.x && this.y === unit.y) {
          done = false
        }
      })
      console.log(this.x, this.y)
      if (done) {
        break;
      }
    }
    this.draw()
  }
  getLocation() {
    return { x: this.x, y: this.y }
  }
  draw() {
    new Unit({
      x: this.x, y: this.y, special: {
        color: 'red'
      }
    })
  }
  update() {
    console.log("update apple", this.x, this.y)
    new Unit({
      x: this.x, y: this.y, special: { color: "black" }
    })
    this.init()
  }
}
class MapRender {
  constructor(timer) {
    this.timer = timer
    this.init()
  }
  init() {
    this.loop = setInterval(() => {
      update()
      show()
    }, this.timer)
  }
  pause() {
    clearInterval(this.loop)
  }
}
const snack = new Snack([])
const apple = new Apple(snack.getArrUnit())
const loop = new MapRender(timer)

function checkCollision() {
  snack.eat(apple.getLocation())
}
function drawSnack() {
  snack.move()
}
function update() {
  checkCollision()
}
function show() {
  drawSnack()
}
function reset() {
  drawer.clearRect(0, 0, canvas.width, canvas.height)
}
function logic(nextDirection) {
  if (state.direction === nextDirection) return false
  if (state.direction === 'r' && nextDirection === 'l') return false
  if (state.direction === 'l' && nextDirection === 'r') return false
  if (state.direction === 't' && nextDirection === 'b') return false
  if (state.direction === 'b' && nextDirection === 't') return false
  return true
}

window.addEventListener("keydown", (event) => {
  setTimeout(() => {
    if (event.key == 'ArrowRight' && logic('r')) {
      state.direction = 'r'
      snack.move()
      checkCollision()
    } else if (event.key == 'ArrowLeft' && logic('l')) {
      state.direction = 'l'
      snack.move()
      checkCollision()
    } else if (event.key == 'ArrowUp' && logic('t')) {
      state.direction = 't'
      snack.move()
      checkCollision()
    } else if (event.key == 'ArrowDown' && logic('b')) {
      state.direction = 'b'
      snack.move()
      checkCollision()
    } else if (event.key == ' ') {
      if (state.loop === "running") {
        loop.pause()
        state.loop = "pause"
      }
      else {
        loop.init()
        state.loop = 'running'
      }
    } else if (event.key == 'Enter') {

    } else if (event.key == 'r') {
      reset()
    }
  }, 1)
})


