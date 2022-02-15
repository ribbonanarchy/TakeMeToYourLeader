let gameScene = new Phaser.Scene('Game');
let wordCount = 0;
let gameW;
let gameH;
let phaserJSON;
let sentenceJSON;
let mouse;
let wordTypeArray = ['nouns', 'adjectives', 'verbs', 'adverbs', 'pronouns', 'prepositions', 'conjuctions', 'articles', 'adjectives', 'verbs'];

gameScene.preload = function(){
    this.load.image('player', '/assets/images/gray-alien.png');
    this.load.image('enemy', '/assets/images/ball.png');

    for(let i=0; i<8; i++){
        gameScene.load.json(`${wordTypeArray[i]}`, `/json/wordTypes/${wordTypeArray[i]}.json`)
    }

    this.load.json('sentence', '/json/text.json');
};

gameScene.create = function(){
    // Get width and height of scene
    gameW = this.sys.game.config.width;
    gameH = this.sys.game.config.height;

    sentenceJSON = this.cache.json.get('sentence');

    // Create a group that all the words will be contained in
    this.words = gameScene.physics.add.group();

    reset();

    // Create our alien and add physics to the sprite
    this.player = this.physics.add.sprite(gameW/2, gameH/2, 'player').setScale(0.15, 0.15);

    // Add a collider between our alien and the words... When they collide they initiate the 'logMsg' function
    this.physics.add.collider(this.player, this.words, logMsg);

    // Create a variable that stores our mouse input coordinates
    mouse = this.input.mousePointer;
};

gameScene.update = function() {

    // When you click on the screen the alien moves to the cursor location
    if((mouse.isDown) && (Math.abs(gameScene.player.x - gameScene.input.x) > 4 || Math.abs(this.player.y - gameScene.input.y) > 4) && (gameScene.input.y < gameH) && (0 < gameScene.input.y)){
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
    for (let i=0; i<10; i++){
        phaserJSON = gameScene.cache.json.get(`${wordTypeArray[i]}`);

        let xArray = [3, 3, 20, 20, 45, 45, 70, 70, 80, 80]; // Percent
        let yArray = [33, 66, 12.5, 87.5, 12.5, 87.5, 12.5, 87.5, 33, 66]; // Percent

        let randomNumb = Math.floor(Math.random()*phaserJSON.length);

        let text = gameScene.add.text(xArray[i]*gameW/100, yArray[i]*gameH/100, phaserJSON[randomNumb], {font: "20px Arial", fill: "rgb(0, 0, 0)"});

        if((i===8)||(i===9)){
            text.x = (gameW - text.width - 15);
        }

        text.immovable = true;
        gameScene.words.add(text);
    }
    console.log(gameScene.words.children.entries[0].text);
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

