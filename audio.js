const audio = {
  backgroundMusic: new Howl({
    src: "./audio/Background-Music.wav",
    loop: true, // Make sure the background music loops
  }),
  //   bomb: new Howl({
  //     src: "./audio/bomb.mp3",
  //   }),
  //   bonus: new Howl({
  //     src: "./audio/bonus.mp3",
  //   }),
  shootEnemy: new Howl({
    src: "./audio/shootEnemy.mp3",
  }),
  Damage_taken: new Howl({
    src: "./audio/Damage_taken.mp3",
  }),
  Death: new Howl({
    src: "./audio/Death.mp3",
  }),
  playerShoot: new Howl({
    src: "./audio/playerShoot.wav",
  }),
};
