const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = document.body.scrollWidth;
canvas.height = document.body.scrollHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;

    this.position = {
      x: 0,
      y: 0,
    };

    this.image = new Image();
    this.image.src = "./img/space-ship.png";
    this.image.onload = () => {
      const scale = 0.12;
      this.width = this.image.width * scale;
      this.height = this.image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 30,
      };
      this.draw();
    };
  }

  draw() {
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);

    c.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 3;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.position = position;

    this.image = new Image();
    this.image.src = "./img/alien.png";
    this.image.onload = () => {
      const scale = 0.06;
      this.width = this.image.width * scale;
      this.height = this.image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
      this.draw();
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(velocity) {
    this.position.x += velocity.x;
    this.position.y += velocity.y;
    this.draw();
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    this.invaders = [];

    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 30;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const invader = new Invader({
          position: {
            x: x * 30,
            y: y * 30,
          },
        });
        this.invaders.push(invader);
      }
    }
    console.log(this.invaders);
  }

  update() {
    this.invaders.forEach((invader) => {
      invader.position.x += this.velocity.x;
      invader.position.y += this.velocity.y;
      invader.draw();
    });
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
      this.invaders.forEach((invader) => {
        invader.position.y += this.velocity.y;
      });
    }
  }
}

const player = new Player();
const projectiles = [];
const grids = [];

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
console.log(randomInterval);

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  projectiles.forEach((projectile, projectileIndex) => {
    if (projectile.position.y + projectile.radius <= 0) {
      projectiles.splice(projectileIndex, 1);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid) => {
    grid.update();
  });

  // Collision detection
  grids.forEach((grid) => {
    grid.invaders.forEach((invader, invaderIndex) => {
      projectiles.forEach((projectile, projectileIndex) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          // Remove the collided invader and projectile
          grid.invaders.splice(invaderIndex, 1);
          projectiles.splice(projectileIndex, 1);
        }
      });
    });
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else if (keys.ArrowLeft.pressed && !keys.ArrowRight.pressed) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (keys.ArrowRight.pressed && !keys.ArrowLeft.pressed) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  // spawning enemies
  if (frames % randomInterval === 0) {
    const newGrid = new Grid();
    grids.push(newGrid);
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;
  }

  frames++;
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case " ":
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: { x: 0, y: -8 },
        })
      );
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
