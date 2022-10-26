const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0

        const image = new Image()
        image.src = './images/spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 40
            }
        }
    }

    draw() {
        c.save()
        c.translate(player.position.x + this.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x + -this.width / 2, -player.position.y + -player.height / 2)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

let randomColor = Math.floor(Math.random() * 16777215).toString(16)

function getRandomColors() {
    let letters = '0123456789ABCDEF';
    let color = '#';
     console.log(color)
    for (let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)]
    }

    return color
}

function getRandomSize() {
    let size = 4; 
    let result = 0
    for (let i = 0; i < size; i++){
        result += Math.floor(Math.random() * size)
    }

    return result
}

class ProjecTile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.radius = getRandomSize()              
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = getRandomColors()
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = './images/invader.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

    
        this.invaders = []

        const rows = Math.floor(Math.random() * 5 + 5)
        const columns = Math.floor(Math.random() * 10 + 2)

        this.width = columns * 30

        for (let x = 0; x < columns; x++){
            for (let y = 0; y < rows; y++){
                this.invaders.push(new Invader({
                    position: {
                        x: x * 30,
                        y: y * 30
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x,
        this.position.y += this.velocity.y
        this.velocity.y = 0
        
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player();
const projectiles = []
const grids = []


const keys = {
    a: {
        press: false,
    },
    d: {
        press: false,
    },
    ArrowRight: {
        press: false,
    },
    ArrowLeft: {
        press: false,
    },
    space: {
        press: false,
    },
}

let frames = 0;
let rdInvadors = Math.floor((Math.random() * 1000) + 250) 
function animate() {
     requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((p, index) => {
        if (p.position.y + p.radius <= 0) {
            setTimeout(() => {
                projectiles.slice(index, 1)
            }, 0)
        } else {
            p.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        grid.invaders?.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius
                    <= invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius
                    >= invader.position.x && projectile.position.x - projectile.radius
                    <= invader.position.x + invader.width && projectile.position.y + projectile.radius
                    >= invader.position.y
                ) {
                setTimeout(() => {
                    const invaderFound = grid.invaders.find((invader2) => {
                        return invader2 === invader
                    })

                    const projectTileFound = projectiles.find((project2) => {
                        return project2 === projectile
                    })

                    if (invaderFound && projectTileFound) {
                      grid.invaders.splice(i, 1)
                        projectiles.splice(j, 1)  
                      
                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length - 1]

                            grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                            grid.position.x = firstInvader.position.x
                        } else {
                            grid.slice(gridIndex, 1)
                        }
                    }
                    },0)
                }
            })
        })

    })

    if (keys.a.press && player.position.x >= 0) {
        player.velocity.x = -10
        player.rotation = -.15
    } else if (keys.ArrowRight.press && player.position.x >= 0) {
        player.velocity.x = 10
        player.rotation = -.15
    } else if (keys.d.press && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 10
        player.rotation = .15
    } else if (keys.ArrowLeft.press && player.position.x + player.width <= canvas.width) {
        player.velocity.x = -10
        player.rotation = .15
    } else {
        player.velocity.x = 0
    }


    if (frames % rdInvadors === 0) {
        grids.push(new Grid())
        frames = 0
        rdInvadors = Math.floor((Math.random() * 1000) + 250) 

    }

    frames++
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.press = true
            break
        case 'd':
            keys.d.press = true
            break
        case 'ArrowRight':
            keys.ArrowRight.press = true
            break
        case 'ArrowLeft':
            keys.ArrowLeft.press = true
            break
        case ' ':
            projectiles.push(new ProjecTile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y,
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.press = false
            break
        case 'd':
            keys.d.press = false
            break
        case ' ':
            keys.space.press = false
            break
        case 'ArrowRight':
            keys.ArrowRight.press = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.press = false
            break
    }
})