// Get canvas element and 2D context
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const livesElement = document.getElementById('lives')

// Initialise variables
let snake = [{ x: 10, y: 10 }]
let dx = 10
let dy = 0
let food = { x: 0, y: 0 }
let gameSpeed = 200
let lives = 3
let score = 0

// Variable to control game pause state
let isPaused = false

// Generate a random food position
function randomFoodPosition() {
	food.x = Math.floor(Math.random() * 25) * 10
	food.y = Math.floor(Math.random() * 25) * 10
}
randomFoodPosition()

// Update life icons based on remaining lives
function updateLives() {
	let lifeIcons = ''
	for (let i = 0; i < lives; i++) {
		lifeIcons += '<span class="life">&#x2764;</span>'
	}
	livesElement.innerHTML = lifeIcons
}

// Update score display
function updateScore() {
	document.getElementById('score').innerText = `Score: ${score}`
}

// Function to pause the game and show life lost message
function pauseGame() {
	isPaused = true
	alert('You lost a life. Press any arrow key to continue.')
}

// Listen for arrow key presses to change direction and resume game
document.addEventListener('keydown', function (event) {
	const arrowKeys = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }
	if (event.keyCode === arrowKeys.LEFT) {
		dx = -10
		dy = 0
	}
	if (event.keyCode === arrowKeys.UP) {
		dx = 0
		dy = -10
	}
	if (event.keyCode === arrowKeys.RIGHT) {
		dx = 10
		dy = 0
	}
	if (event.keyCode === arrowKeys.DOWN) {
		dx = 0
		dy = 10
	}
	isPaused = false
	main()
})

// Check for collision with self
function checkCollision(head, array) {
	for (let i = 0; i < array.length; i++) {
		if (head.x === array[i].x && head.y === array[i].y) {
			return true
		}
	}
	return false
}

// Draw snake and food on canvas
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = 'green'
	for (let part of snake) {
		ctx.fillRect(part.x, part.y, 10, 10)
	}
	ctx.fillStyle = 'red'
	ctx.fillRect(food.x, food.y, 10, 10)
}

// Main game loop
function main() {
	if (isPaused) return

	let head = { x: snake[0].x + dx, y: snake[0].y + dy }
	if (head.x < 0) head.x = canvas.width - 10
	if (head.y < 0) head.y = canvas.height - 10
	if (head.x >= canvas.width) head.x = 0
	if (head.y >= canvas.height) head.y = 0

	if (checkCollision(head, snake)) {
		lives--
		updateLives()
		pauseGame()
		if (lives <= 0) {
			alert('Game Over')
			lives = 3
			gameSpeed = 250
			snake = [{ x: 10, y: 10 }]
			dx = 10
			dy = 0
			score = 0
			randomFoodPosition()
			updateLives()
			updateScore()
		}
		return
	}

	if (head.x === food.x && head.y === food.y) {
		score += 5
		updateScore()
		randomFoodPosition()
		gameSpeed = Math.max(gameSpeed - 5, 50)
	} else {
		snake.pop()
	}

	if (lives > 0) {
		snake.unshift(head)
	}

	draw()
	setTimeout(main, gameSpeed)
}

updateLives()
updateScore()
main()
