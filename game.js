const canvas = document.querySelector("canvas");
const scoreBoard = document.querySelector("#scoreBoard");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 678;

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

    this.isDestroyed = false;
    this.projectilesFired = 0;
    this.maxProjectiles = 5;
    this.hitCount = 0; // New property to track the number of times player is hit
    this.maxHits = 3; // New property to set the maximum hits allowed
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
    if (this.isDestroyed) {
      return;
    }

    this.draw();
    this.position.x += this.velocity.x;

    if (this.projectilesFired < this.maxProjectiles) {
      this.fireProjectile();
      this.projectilesFired++;
    }
  }

  fireProjectile() {
    projectiles.push(
      new Projectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y,
        },
        velocity: { x: 0, y: -8 },
      })
    );
  }

  destroy() {
    this.isDestroyed = true;
    this.velocity.x = 0; // Stop player movement
  }

  hit() {
    this.hitCount++;
    if (this.hitCount >= this.maxHits) {
      this.destroy();
    }
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

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 3;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "yellow";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
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

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
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
class Particle {
  constructor(x, y, velocity, color) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.color = color;
    this.alpha = 1;
    this.radius = 3; // Adjust the size of the particles here
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01; // Adjust the lifespan of the particles here
    this.draw();
  }
}

class Explosion {
  constructor(x, y, color) {
    this.particles = [];
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = {
        x: Math.cos(angle) * (Math.random() * -0.5 + 2),
        y: Math.sin(angle) * (Math.random() * -0.5 + 2),
      };
      this.particles.push(new Particle(x, y, velocity, color));
    }
  }

  update() {
    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        particle.update();
      }
    });
  }
}
class PlayerExplosion {
  constructor(x, y) {
    this.particles = [];
    for (let i = 0; i < 10; i++) {
      // Adjust the number of particles here
      const angle = Math.random() * Math.PI * 2;
      const velocity = {
        x: Math.cos(angle) * (Math.random() * -0.5 + 2), // Adjust the velocity of the particles here
        y: Math.sin(angle) * (Math.random() * -0.5 + 2),
      };
      this.particles.push(new Particle(x, y, velocity, "white")); // Adjust the color of the particles here
    }
  }

  update() {
    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        particle.update();
      }
    });
  }
}

class BackgroundStar {
  constructor(x, y, radius, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }

  update() {
    this.y += this.velocity / 5;
    this.draw();
  }
}

class Background {
  constructor() {
    this.stars = [];
    this.numStars = 120; // Adjust the number of stars in the background
    this.minRadius = 1; // Minimum radius of stars
    this.maxRadius = 3; // Maximum radius of stars
    this.minVelocity = 1; // Minimum vertical velocity of stars
    this.maxVelocity = 3; // Maximum vertical velocity of stars

    // Create random stars with random positions and velocities
    for (let i = 0; i < this.numStars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius =
        Math.random() * (this.maxRadius - this.minRadius) + this.minRadius;
      const velocity =
        Math.random() * (this.maxVelocity - this.minVelocity) +
        this.minVelocity;
      this.stars.push(new BackgroundStar(x, y, radius, velocity));
    }
  }

  update() {
    this.stars.forEach((star) => {
      // Move the star vertically down
      star.update();

      // If the star reaches the bottom of the screen, reposition it at the top
      if (star.y >= canvas.height) {
        star.y = -star.radius;
        star.x = Math.random() * canvas.width;
      }
    });
  }
}

const player = new Player();
const background = new Background();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const explosions = [];
const playerExplosions = [];

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
let freezeTime = 0; // New variable to track the freeze time
let score = 0; // New variable to track the scoreboard

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  // Update the background
  background.update();

  explosions.forEach((explosion) => {
    explosion.update();
  });

  projectiles.forEach((projectile, projectileIndex) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  invaderProjectiles.forEach((invaderProjectile, invaderProjectileIndex) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(invaderProjectileIndex, 1);
      }, 0);
    } else invaderProjectile.update();
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      console.log("You lose!");
      player.hit(); // Player is hit by the invader projectile

      // Create a player explosion at the position of the player
      const playerExplosion = new PlayerExplosion(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
      );
      playerExplosions.push(playerExplosion);

      // Remove the collided invader projectile
      invaderProjectiles.splice(invaderProjectileIndex, 1);
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();
    if (grid.invaders.length === 0) {
      grids.splice(gridIndex, 1); // Remove the grid when invaders are destroyed
    }
    // spawning projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }
    playerExplosions.forEach((playerExplosion) => {
      playerExplosion.update();
    });
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
          // Create an explosion at the position of the invader
          const explosion = new Explosion(
            invader.position.x + invader.width / 2,
            invader.position.y + invader.height / 2,
            "orange"
          );
          explosions.push(explosion);

          // Remove the collided invader and projectile
          grid.invaders.splice(invaderIndex, 1);
          projectiles.splice(projectileIndex, 1);
          score += 100;
          console.log(score);
          scoreBoard.innerHTML = score;
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
  if (frames % randomInterval === 0 && freezeTime <= 0) {
    const newGrid = new Grid();
    grids.push(newGrid);
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;
  }

  frames++;

  // Freeze elements for 2 seconds after player is destroyed
  if (player.isDestroyed) {
    freezeTime = 120; // 2 seconds (60 frames per second)
    playerExplosions.forEach((playerExplosion) => {
      playerExplosion.update();
    });
    projectiles.length = 0; // Clear projectiles
    invaderProjectiles.length = 0; // Clear invader projectiles
    grids.forEach((grid) => {
      grid.invaders.length = 0; // Clear invaders
    });
    explosions.length = 0; // Clear explosions
    playerExplosions.length = 0; // Clear player explosions
  }

  // Countdown freeze time
  if (freezeTime > 0) {
    freezeTime--;
  }
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
      if (!player.isDestroyed) {
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: { x: 0, y: -8 },
          })
        );
      }
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
