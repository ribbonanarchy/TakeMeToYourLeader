// Initialize our scene
let gameScene = new Phaser.Scene('Game');

// Initialize variables that need to be in global scope
let wordCount = 0;
let gameW;
let gameH;
let phaserJSON;
let sentenceJSON;
let mouse;

// Keep track of the type of words we display... This will be looped through to access names of our word jsons
let wordTypeArray = ['nouns', 'adjectives', 'verbs', 'adverbs', 'pronouns', 'prepositions', 'conjuctions', 'articles', 'adjectives', 'verbs'];

// This element will display our current sentence for the user
let sentenceDisplay = document.getElementById('sentence');
let wordDisplay = document.getElementById('word-counter');

// Buttons
let btnPlural = document.getElementById('plural');
let btnSimple = document.getElementById('simple');
let btnParticiple = document.getElementById('participle');
let btnFinalize = document.getElementById('finalize');

// Sentence posting button starts off hidden
btnFinalize.style.visibility = "hidden";
btnFinalize.style.display = "none";

// Used to know what words in our word array need to be updated... When we click verb/noun edits
let nounIndex = 0;
let verbIndex = [2, 9];

// Booleans to keep track of our word types activated
let plural;
let verbSimplePast;
let verbPastParticiple;
let verbRandomNumb = [];

// Create var for end of noun word
let nounEnd;

let profileColor = document.getElementById('hidden-color').textContent;
let profileMood = document.getElementById('hidden-mood').textContent;

gameScene.preload = function(){

    this.load.image('player', `/images/${profileMood}/${profileColor}.png`);

    for(let i=0; i<8; i++){
        gameScene.load.json(`${wordTypeArray[i]}`, `/json/wordTypes/${wordTypeArray[i]}.json`)
    }

    // Also variable verb tense options
    this.load.json('verbSimplePast', `/json/wordTypes/verbSimplePast.json`)
    this.load.json('verbPastParticiple', `/json/wordTypes/verbPastParticiple.json`)

    this.load.json('sentence', '/json/text.json');
};

gameScene.create = function(){

    // Get width and height of scene
    gameW = this.sys.game.config.width;
    gameH = this.sys.game.config.height;

    sentenceJSON = this.cache.json.get('sentence');

    // Create a group that all the words will be contained in
    this.words = gameScene.physics.add.group();

    // Create our alien and add physics to the sprite
    this.player = this.physics.add.sprite(gameW/2, gameH/2, 'player').setScale(0.15, 0.15);

    // Add a collider between our alien and the words... When they collide they initiate the 'logMsg' function
    this.physics.add.collider(this.player, this.words, logMsg);

    // Create a variable that stores our mouse input coordinates
    // mouse = this.input.mousePointer;
    mouse = this.input.activePointer;

    reset();
};

gameScene.update = function() {
    mouse = this.input.activePointer;

    // When you click on the screen the alien moves to the cursor location
    if((mouse.isDown) && (Math.abs(gameScene.player.x - gameScene.input.x) > 4 || Math.abs(this.player.y - gameScene.input.y) > 4) && (gameScene.input.y < gameH) && (0 < gameScene.input.y) && (gameScene.input.x < gameW) && (0 < gameScene.input.x)){
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
    sentenceDisplay.textContent = sentenceJSON.sentence;

    // Display to the user how many words they have left
    if(wordCount < 10){
        wordDisplay.textContent = "You Need Atleast " + (10 - wordCount) + " More Words!";
    }

    // When we have 10 words in our string then post our sentence to the sequelize database
    if((wordCount >= 10) && (wordCount !== 20)){
        wordDisplay.textContent = "You Can Use " + (20 - wordCount) + " More Words!";

        // Display Button for Posting Sentence
        btnFinalize.style.visibility = "visible";
        btnFinalize.style.display = "block";
    }
    else if(wordCount === 20){
        finalizeSentence();
    }

    reset();
}

// Post sentence to sequelize database
const postSentence = async () => {
  
    const sentence = sentenceJSON.sentence.replace(/\s+$/, '') + ".";
    console.log(sentence);

    // Send a POST request to the API endpoint
    const response = await fetch('/api/sentence', {
    method: 'POST',
    body: JSON.stringify({ sentence }),
    headers: { 'Content-Type': 'application/json' },
    });

    sentenceJSON.sentence = "";
};

// Reset the words and alien location
function reset(){
    // Clear off all the old words
    gameScene.words.clear(true);

    // Reposition alien into middle of page
    gameScene.player.x = gameW/2;
    gameScene.player.y = gameH/2;

    // Reset all noun/verb special tense
    plural = false;
    verbPastParticiple = false;
    verbSimplePast = false;

    // Reset button highlights
    btnParticiple.style = "box-shadow: none";
    btnSimple.style = "box-shadow: none";
    btnPlural.style = "box-shadow: none";

    // Instantiate 10 random words and populate the screen with them
    for (let i=0; i<10; i++){
        phaserJSON = gameScene.cache.json.get(`${wordTypeArray[i]}`);

        let xArray = [3, 3, 20, 20, 45, 45, 70, 70, 80, 80]; // Percent Values
        let yArray = [33, 66, 12.5, 87.5, 12.5, 87.5, 12.5, 87.5, 33, 66]; // Percent Values

        let randomNumb = Math.floor(Math.random()*phaserJSON.length);

        let text = gameScene.add.text(xArray[i]*gameW/100, yArray[i]*gameH/100, phaserJSON[randomNumb], {font: "20px Arial", fill: "rgb(0, 0, 0)"});

        // The last two words should be right aligned with a margin of 15
        // Keep track of the random index numbers associate to each verb
        if(i===2){
            verbRandomNumb[0] = randomNumb;
        }
        else if((i===8)){
            text.x = (gameW - text.width - 15);
        }
        else if (i===9){
            text.x = (gameW - text.width - 15);
            verbRandomNumb[1] = randomNumb;
        }



        // If this is the first word of the sentence then capitalize its first letter
        if(wordCount === 0){
            text.text = text.text[0].toUpperCase() + text.text.substring(1);
        }

        text.immovable = true;
        gameScene.words.add(text);
    }
}

function simplePastVerb(){
    let verbJSON;
    let random1 = verbRandomNumb[0];
    let random2 = verbRandomNumb[1];
    btnParticiple.style = "box-shadow: none";

    if(!verbSimplePast){
        btnSimple.style = "box-shadow: 0 0 5px 5px green";

        verbJSON = gameScene.cache.json.get('verbSimplePast');

        gameScene.words.children.entries[2].text = verbJSON[random1];
        gameScene.words.children.entries[9].text = verbJSON[random2];

        verbSimplePast = true;
    }
    else{
        btnSimple.style = "box-shadow: none";

        verbJSON = gameScene.cache.json.get('verbs');
        gameScene.words.children.entries[verbIndex[0]].text = verbJSON[random1];
        gameScene.words.children.entries[verbIndex[1]].text = verbJSON[random2];

        verbSimplePast = false;
    }

    // If this is the first word of the sentence then capitalize its first letter
    if(wordCount === 0){
        gameScene.words.children.entries[verbIndex[0]].text = gameScene.words.children.entries[verbIndex[0]].text[0].toUpperCase() + gameScene.words.children.entries[verbIndex[0]].text.substring(1);
        gameScene.words.children.entries[verbIndex[1]].text = gameScene.words.children.entries[verbIndex[1]].text[0].toUpperCase() + gameScene.words.children.entries[verbIndex[1]].text.substring(1);
    }

    verbPastParticiple = false;
}

function pastParticibleVerb(){
    let verbJSON;
    let random1 = verbRandomNumb[0];
    let random2 = verbRandomNumb[1];
    btnSimple.style = "box-shadow: none";


    if(!verbPastParticiple){
        btnParticiple.style = "box-shadow: 0 0 5px 5px green";

        verbJSON = gameScene.cache.json.get('verbPastParticiple');

        gameScene.words.children.entries[2].text = verbJSON[random1];
        gameScene.words.children.entries[9].text = verbJSON[random2];

        verbPastParticiple = true;
    }
    else{
        btnParticiple.style = "box-shadow: none";

        verbJSON = gameScene.cache.json.get('verbs');
        gameScene.words.children.entries[verbIndex[0]].text = verbJSON[random1];
        gameScene.words.children.entries[verbIndex[1]].text = verbJSON[random2];

        verbPastParticiple = false;
    }

    // If this is the first word of the sentence then capitalize its first letter
    if(wordCount === 0){
        gameScene.words.children.entries[verbIndex[0]].text = gameScene.words.children.entries[verbIndex[0]].text[0].toUpperCase() + gameScene.words.children.entries[verbIndex[0]].text.substring(1);
        gameScene.words.children.entries[verbIndex[1]].text = gameScene.words.children.entries[verbIndex[1]].text[0].toUpperCase() + gameScene.words.children.entries[verbIndex[1]].text.substring(1);
    }

    verbSimplePast = false;
}

function pluralNoun(){
    // Create var for noun text... a long callback to create everytime D:
    let currentNoun = gameScene.words.children.entries[0].text;
    let stringLength = currentNoun.length;

    // Turn the word plural or singular
    if(!plural){
        btnPlural.style = "box-shadow: 0 0 5px 5px green";

        switch(currentNoun[stringLength - 1]){
            case "y":
                // Check if the letter before y is a vowl?
                if((currentNoun[stringLength - 2] === "a") || (currentNoun[stringLength - 2] === "e") || (currentNoun[stringLength - 2] === "i") || (currentNoun[stringLength - 2] === "o")){
                    gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "s";
                    nounEnd = "";
                    break;
                }
                else{
                    gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text.slice(0, -1)
                    gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "ies";
                    nounEnd = "y";
                    break;
                }
            case "s":
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "es";
                nounEnd = "oxsh";
                break;
            case "x":
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "es";
                nounEnd = "oxsh";
                break;
            case "o":
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "es";
                nounEnd = "oxsh";
                break;
            case "h":
                // Check if the letter before h is c or s?
                if((currentNoun[stringLength - 2] === "c") || (currentNoun[stringLength - 2] === "s")){
                    gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "es";
                    nounEnd = "oxsh";
                    break;
                }
                else{
                    gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "s";
                    nounEnd = "";
                    break;
                }
            case "f":
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text.slice(0, -1)
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "ves";
                nounEnd = "f";
                break;
            default:
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "s";
        }
        plural = true;
    }
    else{
        btnPlural.style = "box-shadow: none";

        switch(nounEnd){
            case "y":
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text.slice(0, -3)
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "y";
                break;
            case "oxsh":
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text.slice(0, -2)
                break;
            case "f":
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text.slice(0, -3)
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text + "f";
                break;
            default:
                gameScene.words.children.entries[0].text = gameScene.words.children.entries[0].text.slice(0, -1)
        }
        plural = false;
    }
}

function finalizeSentence(){
    postSentence();

    // Hide submit sentence button
    btnFinalize.style.visibility = "hidden";
    btnFinalize.style.display = "none";

    sentenceDisplay.textContent = "Create a Sentence...";
    wordDisplay.textContent = "You Need Atleast 10 More Words!";
    wordCount = 0;
}

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'parent',
    backgroundColor: "rgb(68, 122, 54)",
    scene: gameScene,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{ y:0 }
        }
    },
};

let game = new Phaser.Game(config);