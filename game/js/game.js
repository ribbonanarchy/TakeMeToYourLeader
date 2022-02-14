let gameScene = new Phaser.Scene('Game');

gameScene.preload = function(){
    this.load.image('player', 'assets/images/gray-alien.png');
    this.load.image('enemy', 'assets/images/ball.png');

    this.load.json('text', './wordlist.json');
    this.load.json('sentence', './text.json');
};

gameScene.create = function(){
    // Get width and height of scene
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    let phaserJSON = this.cache.json.get('text');
    gameScene.sentenceJSON = this.cache.json.get('sentence');

    // Create a group that all the words will be contained in
    this.words = gameScene.physics.add.group();

    // Create 8 random words and populate the screen with them
    for (let i=0; i<8; i++){
        let xArray = [1/10, 1/10, 1/3, 1/3, 3/5, 3/5, 4/5, 4/5];
        let yArray = [1/3, 2/3, 1/8, 7/8, 1/8, 7/8, 1/3, 2/3];

        let randomNumb = Math.floor(Math.random()*12447);

        let text = gameScene.add.text(xArray[i]*gameW, yArray[i]*gameH, phaserJSON[randomNumb], {font: "20px Arial", fill: "rgb(0, 0, 0)"});
        text.immovable = true;
        gameScene.words.add(text);
    }

    // Create our alien and add physics to the sprite
    this.player = this.physics.add.sprite(gameW/2, gameH/2, 'player').setScale(0.15, 0.15);

    // Add a collider between our alien and the words... When they collide they initiate the 'logMsg' function
    this.physics.add.collider(this.player, this.words, logMsg);

    // Create a variable that stores our mouse input coordinates
    this.mouse = this.input.mousePointer;


    // this.word = gameScene.add.text(100, 100, gameScene.phaserJSON.word, {font: "65px Arial", fill: "#ff0044"});
    // this.bg.setPosition(640/2, 360/2);

    // NOTES //    
    // player.depth = 1; We can change the layer of the sprite
    // player.setScale(2,2); We can double dimensions of sprite

    // enemy1.setRotation(45); Rotates a sprite

};

gameScene.update = function() {
    if((gameScene.mouse.isDown) && (Math.abs(gameScene.player.x - gameScene.input.x) > 4 || Math.abs(this.player.y - gameScene.input.y) > 4)){
        gameScene.physics.moveTo(gameScene.player, gameScene.input.x, gameScene.input.y, 300);
    }
    else {
        gameScene.player.setVelocity(0,0);
    }
};

function logMsg(player, words){
    gameScene.sentenceJSON.sentence = gameScene.sentenceJSON.sentence + words.text + " ";
    console.log(gameScene.sentenceJSON.sentence);
    // console.log(words.text)
    gameScene.scene.restart();
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

