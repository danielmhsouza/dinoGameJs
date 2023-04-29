const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Dino {
    constructor() {
        this.width = 30;
        this.height = 70;
        this.x = this.width + 30;
        this.y = canvas.height - this.height - 10;
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpForce = 10;
        this.isJumping = false;

        this.points = {
            p1: {x: this.x, y: this.y},
            p2: {x: this.x + this.width, y: this.y},
            p3: {x:this.x, y: this.y + this.height},
            p4: {x: this.x + this.width, y: this.y + this.height}
        }
    }

    draw(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.isJumping) {
            this.velocity = -this.jumpForce;
            this.isJumping = true;
        }
    }
    down() {
        this.velocity = this.jumpForce;
    }

    checkCollision(cactus) {
        cactus.points = {
            p1: {x: cactus.x, y: cactus.y},
            p2: {x: cactus.x + cactus.width, y: cactus.y},
            p3: {x:cactus.x, y: cactus.y + cactus.height},
            p4: {x: cactus.x + cactus.width, y: cactus.y + cactus.height}
        }

        this.points = {
            p1: {x: this.x, y: this.y},
            p2: {x: this.x + this.width, y: this.y},
            p3: {x:this.x, y: this.y + this.height},
            p4: {x: this.x + this.width, y: this.y + this.height}
        }



        return (
            (
                (this.points.p4.x >= cactus.points.p1.x && this.points.p4.y >= cactus.points.p1.y) &&
                (this.points.p1.x < cactus.points.p1.x && this.points.p1.y < cactus.points.p1.y)
            ) ||
            ( 
                (this.points.p3.x <= cactus.points.p2.x && this.points.p3.y >= cactus.points.p2.y) &&
                (this.points.p2.x > cactus.points.p2.x && this.points.p2.y < cactus.points.p2.y)
            ) ||
            (
                (this.points.p2.x >= cactus.points.p3.x && this.points.p2.y <= cactus.points.p3.y) &&
                (this.points.p3.x < cactus.points.p3.x && this.points.p3.y > cactus.points.p3.y)
            ) ||
            (
                (this.points.p1.x <= cactus.points.p4.x && this.points.p1.y <= cactus.points.p4.y) &&
                (this.points.p4.x > cactus.points.p4.x && this.points.p4.y > cactus.points.p4.y)
            )
        )
    }

    update() {
        this.y += this.velocity;
        this.velocity += this.gravity;

        if (this.y > canvas.height - this.height - 10) {
            this.y = canvas.height - this.height - 10;
            this.isJumping = false;
        }
    }
}

class Cactus {
    constructor() {
        this.x = canvas.width - 10;
        this.width = 30;
        this.height = 50;
        this.y = canvas.height - this.height - 10;
        this.speed = 6;

        this.points = {
            p1: {x: this.x, y: this.y},
            p2: {x: this.x + this.width, y: this.y},
            p3: {x:this.x, y: this.y + this.height},
            p4: {x: this.x + this.width, y: this.y + this.height}
        }
    }

    setHeight() {
        this.height = 20 + Math.random() * 30;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime;

        if (this.x < 0) {
            this.x = canvas.width - 10;
            cactus.speed += 0.5
            this.setHeight()
        }
    }
}


const dino = new Dino();
const cactus = new Cactus()
var gameLoop = false
var points = 0;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dino.update();
    dino.draw(ctx);


    cactus.draw(ctx)
    cactus.update(0.5);

    if(dino.checkCollision(cactus)){
        gameLoop = false;
        cactus.speed = 0;
        ctx.fillStyle = '#222';
        ctx.font = '25px Arial';
        ctx.fillText(`VOCE PERDEU, QUE BURRO!`, canvas.width/2-160, canvas.height/2-25)
    }else{
        if(gameLoop){
            points += 1;
            ctx.fillStyle = '#222';
            ctx.font = '20px Arial';
            ctx.fillText(`${points} metros`, canvas.width - 135, 30)
            ctx.fillText(`velocidade: ${cactus.speed}`, canvas.width - 135, 60)
        }
        else{
            ctx.fillStyle = '#222';
            ctx.font = '25px Arial';
            ctx.fillText(`Click para começar`, canvas.width/2-100, canvas.height/2-25)
            cactus.speed = 0;
        }
    }

    requestAnimationFrame(update);
}

function resetGame(){
    points = 0;
    cactus.speed = 6;
    cactus.x = canvas.width - 10;
    gameLoop = true
    
}


document.addEventListener("keydown", (e) => {
    if (e.code == 'Space' || e.code == 'ArrowUp') {
        dino.jump();
        if(!gameLoop){
            resetGame()
        }
    }
    if (e.code == 'ArrowDown') {
        dino.height = 20;
        dino.width = 50;
        dino.down();
    }

});
document.addEventListener('keyup', (e) => {
    dino.width = 30;
    dino.height = 70;
   
})
canvas.addEventListener("click", () => {
    dino.jump()
    if(!gameLoop){
        resetGame()
    }
});

update()