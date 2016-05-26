/**
 * Created by Viacheslav_Valitskas on 11/16/2015.
 */
var canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext('2d');
// to move
var x = canvas.width / 2,      //balls' start coordinates
    y = canvas.height - 30;    //balls' start coordinates

// balls' speed
var dx = 3,                 // horizontal movement step
    dy = -3;                // vertical movement step
var speed = Math.abs(Math.round(Math.floor(dx/2)));

var ballRadius = 5;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = canvas.width - paddleWidth/2,
    paddleY = canvas.height - paddleHeight/2;
var rightPressed = false,
    leftPressed = false;
// bricks
var brickRowCount = 10,
    brickColumnCount = 20,
    brickWidth = 28,
    brickHeight = 10,
    brickPadding = 2,
    brickOffsetTop = 40,
    brickOffsetLeft = 20;

//var packX, packY, packColor,
var packIsOn = [];
// game state
var isLost = false,
    isStarted = false,
    isPaused = false,
    isWin = false;

var score = 0;
var lives = 3;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        var brickType = Math.round(Math.random()) ? {} : "regular";
        bricks[c][r] = {x: 0, y: 0, status: 1, type: brickType};
        if(bricks[c][r].type != 0) {
            bricks[c][r].type.speedup = Math.round(Math.random()) ? "faster" : "slower";
        }
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);


var screenText = {
    start: function () {
        ctx.font = "50px Arial";
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2);
    },
    lost: function () {
        ctx.font = "50px Arial";
        ctx.fillStyle = 'green';
        ctx.textAlign = 'center';
        ctx.fillText("Game Over DUDE", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText("Press Enter for The New Game", canvas.width / 2, (canvas.height / 2) + 30);
    },
    pause: function () {
        ctx.font = "50px Arial";
        ctx.fillStyle = 'green';
        ctx.textAlign = 'center';
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    },
    win: function() {
        ctx.font = "50px Arial";
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.fillText("Congrats MAN!! You did it!", canvas.width / 2, canvas.height / 2);
    }

};

var commands = {
    start: function () {

    }
};

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
    // space button -- pause
    if (e.keyCode == 32) {
        isPaused = !isPaused;
    }
    // enter -- for start the game
    if (e.keyCode == 13 && !isLost) {
        isStarted = true;
    } else if (e.keyCode == 13) {
        document.location.reload();
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function xInTheRange(x, min, max) {
    if(x >= min && x <= max) return true
        else return false
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = bricks[c][r].x = (c * (brickWidth + brickPadding) + brickOffsetLeft);
                var brickY = bricks[c][r].y = (r * (brickHeight + brickPadding) + brickOffsetTop);
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection() {
    //detect collision between ball and brick
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                ////if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && b.y < y + ballRadius && y - ballRadius < b.y + brickHeight) {
                //if (x > b.x && x < b.x + brickWidth && b.y < y && y < b.y + brickHeight + 10) {
                //    dy = -dy;
                //    b.status = 0;
                //    score++;
                //    if(b.type != "regular") {
                //        packIsOn.push({packX: b.x + brickWidth/2, packY: b.y + brickHeight + 10});
                //        //packX = b.x + brickWidth/2;
                //        //packY = b.y + brickHeight + 10;
                //        if(b.type.speedup == "faster") {
                //            packIsOn[packIsOn.length - 1].packColor = "#ff1a1a";
                //            packIsOn[packIsOn.length - 1].text = "SpeedUp"
                //        } else {
                //            packIsOn[packIsOn.length - 1].packColor = "#00cc00";
                //            packIsOn[packIsOn.length - 1].text = "SpeedDown"
                //        }
                //    }
                //    if(score == brickColumnCount * brickRowCount) {
                //        isWin = true;
                //        ctx.clearRect(0, 0, canvas.width, canvas.height);
                //        screenText.win();
                //        drawScore();
                //        drawSpeed();
                //        drawLives();
                //    }
                //}
                if ((xInTheRange(x + ballRadius, b.x - dx, b.x) && y >= b.y && y <= b.y + brickHeight) || (xInTheRange(x - ballRadius, b.x + brickWidth - Math.abs(dx), b.x + brickWidth - dx) && y >= b.y && y <= b.y + brickHeight)) {
                        dx = -dx;
                        b.status = 0;
                        score++;
                        if(b.type != "regular") {
                            packIsOn.push({packX: b.x + brickWidth/2, packY: b.y + brickHeight + 10});
                            //packX = b.x + brickWidth/2;
                            //packY = b.y + brickHeight + 10;
                            if(b.type.speedup == "faster") {
                                packIsOn[packIsOn.length - 1].packColor = "#ff1a1a";
                                packIsOn[packIsOn.length - 1].text = "SpeedUp"
                            } else {
                                packIsOn[packIsOn.length - 1].packColor = "#00cc00";
                                packIsOn[packIsOn.length - 1].text = "SpeedDown"
                            }
                        }
                        if(score == brickColumnCount * brickRowCount) {
                            isWin = true;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            screenText.win();
                            drawScore();
                            drawSpeed();
                            drawLives();
                        }
                }
                if ((xInTheRange(y - ballRadius, b.y + brickHeight - Math.abs(dy), b.y + brickHeight - dy) && x >= b.x && x <= b.x + brickWidth) || (xInTheRange(y + ballRadius, b.y - dy, b.y + dy) && x >= b.x && x <= b.x + brickWidth)) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(b.type != "regular") {
                        packIsOn.push({packX: b.x + brickWidth/2, packY: b.y + brickHeight + 10});
                        //packX = b.x + brickWidth/2;
                        //packY = b.y + brickHeight + 10;
                        if(b.type.speedup == "faster") {
                            packIsOn[packIsOn.length - 1].packColor = "#ff1a1a";
                            packIsOn[packIsOn.length - 1].text = "SpeedUp"
                        } else {
                            packIsOn[packIsOn.length - 1].packColor = "#00cc00";
                            packIsOn[packIsOn.length - 1].text = "SpeedDown"
                        }
                    }
                    if(score == brickColumnCount * brickRowCount) {
                        isWin = true;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        screenText.win();
                        drawScore();
                        drawSpeed();
                        drawLives();
                    }
                }
            }
        }
    }
    //detect collision between pack and paddle
    for(var i = 0; i < packIsOn.length; i++) {
        if(packIsOn[i].packX > paddleX && packIsOn[i].packX < paddleX + paddleWidth && packIsOn[i].packY > canvas.height - paddleHeight) {
            if(packIsOn[i].packColor == "#ff1a1a") {
                dx = dx > 0 ? dx + 2 : dx - 2;
                dy = dy > 0 ? dy + 2 : dy - 2;;
            } else if(packIsOn[i].packColor == "#00cc00" && Math.abs(dx) > 3) {
                dx = dx > 0 ? dx - 2 : dx + 2;
                dy = dy > 0 ? dy - 2 : dy + 2;
            }
            packIsOn.shift();
        } else if(packIsOn[i].packY > canvas.height){
            packIsOn.shift();
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = "#0095DD";
    ctx.fillText('Score: ' + score, 50, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = "#0095DD";
    ctx.fillText('Lives: ' + lives, canvas.width - 55, 20);
}

function drawSpeed() {
    ctx.font = '16px Arial';
    ctx.fillStyle = "#0095DD";
    ctx.fillText('Speed: ' + speed, 150, 20);
}

function drawPack() {
    for (var i = 0; i < packIsOn.length; i++) {
        ctx.font = '12px Arial';
        //ctx.arc(packIsOn[i].packX, packIsOn[i].packY, 6, 0, Math.PI*2)
        ctx.fillStyle = packIsOn[i].packColor;
        ctx.fillText(packIsOn[i].text, packIsOn[i].packX, packIsOn[i].packY);
    }

}

function draw() {
    if (!isStarted) {
        screenText.start();
    }
    if (isStarted && !isPaused && !isWin) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        drawScore();
        drawSpeed();
        drawLives();
        if(packIsOn.length > 0) {
            for(var i = 0; i < packIsOn.length; i++) {
                packIsOn[i].packY += 2;
            }
            drawPack();
        }

        collisionDetection();

        // if the ball reached horizontal boundaries then reverse direction
        if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
            dx = -dx;
        }
        // if the ball reached vertical boundaries then reverse direction
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius - paddleHeight) {
            if (x > paddleX && x < paddleX + paddleWidth) { // if on the button ball collided with paddle
                dy = -dy;                                    // bounce back
            }
            else if (y + dy > canvas.height + ballRadius) {           //else when ball touched bottom - game over
                //alert('GAME OVER DUDE');
                //document.location.reload();
                lives--;
                if(!lives) {
                    screenText.lost();
                    isLost = true;
                    isPaused = true;
                } else {
                    x = canvas.width/2;
                    y = canvas.height - 30;
                    paddleX = (canvas.width- paddleWidth)/2;
                }

            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx; //move the ball by x axis
        y += dy; // move the ball by y axis
    } else if (isStarted && !isLost && !isWin) {
        screenText.pause();
    }
    requestAnimationFrame(draw)
}

draw();