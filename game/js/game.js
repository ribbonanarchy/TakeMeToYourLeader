let gameScene = new Phaser.Scene('Game');
let wordCount = 0;
let gameW;
let gameH;
let phaserJSON;
let sentenceJSON;

gameScene.preload = function(){
    this.load.image('player', 'assets/images/gray-alien.png');
    this.load.image('enemy', 'assets/images/ball.png');

    this.load.json('text', './wordlist.json');
    this.load.json('sentence', './text.json');
};

gameScene.create = function(){
    // Get width and height of scene
    gameW = this.sys.game.config.width;
    gameH = this.sys.game.config.height;

    phaserJSON = this.cache.json.get('text');
    sentenceJSON = this.cache.json.get('sentence');

    // Create a group that all the words will be contained in
    this.words = gameScene.physics.add.group();

    reset();

    // Create our alien and add physics to the sprite
    this.player = this.physics.add.sprite(gameW/2, gameH/2, 'player').setScale(0.15, 0.15);

    // Add a collider between our alien and the words... When they collide they initiate the 'logMsg' function
    this.physics.add.collider(this.player, this.words, logMsg);

    // Create a variable that stores our mouse input coordinates
    this.mouse = this.input.mousePointer;
};

gameScene.update = function() {

    // When you click on the screen the alien moves to the cursor location
    if((gameScene.mouse.isDown) && (Math.abs(gameScene.player.x - gameScene.input.x) > 4 || Math.abs(this.player.y - gameScene.input.y) > 4)){
        gameScene.physics.moveTo(gameScene.player, gameScene.input.x, gameScene.input.y, 300);
    }
    else {
        gameScene.player.setVelocity(0,0);
    }
};

// Append new word to our sentence string
function logMsg(player, words){
    wordCount++;
    sentenceJSON.sentence = sentenceJSON.sentence + words.text + " ";

    // When we have 10 words in our string then post our sentence to the sequelize database
    if(wordCount === 10){
        postSentence();
        wordCount = 0;
    }

    gameScene.scene.restart();
}

// Post sentence to sequelize database
const postSentence = async () => {
  
    const sentence = sentenceJSON.sentence;
    console.log(sentence);
    // Send a POST request to the API endpoint
    const response = await fetch('/api/sentence', {
    method: 'POST',
    body: JSON.stringify({ sentence }),
    headers: { 'Content-Type': 'application/json' },
    });
};

// Reset the words and alien location
function reset(){
    // Create 8 random words and populate the screen with them
    for (let i=0; i<8; i++){
        let xArray = [1/10, 1/10, 1/3, 1/3, 3/5, 3/5, 4/5, 4/5];
        let yArray = [1/3, 2/3, 1/8, 7/8, 1/8, 7/8, 1/3, 2/3];

        let randomNumb = Math.floor(Math.random()*12447);

        let text = gameScene.add.text(xArray[i]*gameW, yArray[i]*gameH, phaserJSON[randomNumb], {font: "20px Arial", fill: "rgb(0, 0, 0)"});
        text.immovable = true;
        gameScene.words.add(text);
    }
}

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    backgroundColor: "rgb(68, 122, 54)",
    scene: gameScene,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:0}
        }
    }
};

let game = new Phaser.Game(config);

