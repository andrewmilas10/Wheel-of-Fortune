
var WheelLogic = function() {
    var wheelValues = [250, 300, 'bankrupt', 750, 250, 300, 200, 2500, 500, 400, 300, 200, 'bankrupt', 5000, 200, 500, 450, 'lose a turn', 400, 250, 900, 150, 400, 600];
    var delay=.05;
    var slotToLand;

    this.counter=0;
    var _self = this;
    
    //called when the spin wheel button is pressed.
    //chooses a random slot number for the wheel to land on, and calls another function to start spinning the wheel with a delay
    //I didn't use the way to spin the wheel on the extras drive. I created my own that rotated the wheel picture.
    this.spinWheel = function() {
        console.debug("spin wheel");
        toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle', 'continue'], 'hidden');
        _self.counter = _self.counter%360;
        delay =.05;
        slotToLand = Math.trunc(Math.random() * wheelValues.length); //picks a random wheel slot number
        // if (toggledWheel%2===0) {           // Testing Purposes
        //     document.getElementById('wheel').style.transform = 'rotate(' + ((24-slotToLand)*15) + 'deg)';
        //     wheelGuess();
        // }
        // else {
        setTimeout(rotateLoop, delay);
        // }
    };

    this.wheelAmount = function(){
        return wheelValues[slotToLand];
    };

    //repeatedly rotates the wheel after a constantly increasing delay (to give the illusion of slowing down)
    // until the wheel passes the first slot twice and eventually lands on the correct slot
    var rotateLoop = function() {
        //console.debug("rotate loop");
        if (_self.counter < 720 + (24 - slotToLand) * 15) {
            document.getElementById('wheel').style.transform = 'rotate(' + _self.counter + 'deg)';
            _self.counter += .9;
            delay += .013;
            setTimeout(rotateLoop, delay);
        }
        else {//stops the wheel spinning process and moves to the guess-picking part of spinning the wheel
            wheelGuess()
        }
    };


    //alerts the player when getting a bankrupt or 'lose a turn'. Otherwise it allows the person to make a guess
    var wheelGuess = function() { //executes if wheel landed on bankrupt
        if (_self.wheelAmount() === 'bankrupt') {
            console.debug("wheel guess bankrupt");
            document.getElementById('turnInfo').innerHTML = "Oh, you landed on bankrupt. You lose your turn and all of your money for this round.";
            if ((settings.isComputer)&&(game.playerIndex() === game.names.length-1)) {
                document.getElementById('turnInfo').innerHTML = "Just my luck, of course I landed on bankrupt, losing my money for this round.";
            }
            game.roundScores[game.playerIndex()] = 0;
            game.whoseTurn += 1;
            updateScores();
            toggleVisibility(['nextTurn'], 'visible');
        }
        else if (_self.wheelAmount() === 'lose a turn') { //executes if wheel landed one 'lose a turn'
            console.debug("wheel guess lose a turn");
            document.getElementById('turnInfo').innerHTML="Oh, you just lost your turn.";
            if ((settings.isComputer) && (game.playerIndex() === game.names.length-1)) {
                document.getElementById('turnInfo').innerHTML="Man, why did I have to lose my turn. I had the perfect guess ready.";
            }
            game.whoseTurn += 1;
            toggleVisibility(['nextTurn'], 'visible');
        }
        else { //executes if a dollar value was chosen
            console.debug("wheel guess amount: " + _self.wheelAmount());
            document.getElementById('turnInfo').innerHTML = game.names[game.playerIndex()] + ", you spun $" + _self.wheelAmount() + '.';
            game.letterType='consonant';
            game.validLetters = game.consonants;
            if ((settings.isComputer) && (game.playerIndex()===game.names.length-1)) {
                toggleVisibility(['continue'], 'visible');
                document.getElementById('continue').onclick=checkGuess;
                if (_self.wheelAmount() <= 400) {
                    document.getElementById('turnInfo').innerHTML = "Really, only $" + _self.wheelAmount() + ". Whatever, I will guess " + game.currentGuess + '.';
                }
                else {
                    document.getElementById('turnInfo').innerHTML = "Not bad, $" + _self.wheelAmount() + ". Anyway, I will guess " + game.currentGuess + '.';
                }
            }
            else {
                document.getElementById('turnInfo2').innerHTML="What " + game.letterType + " do you want to guess? Press enter to submit the value in the input box below.";
                game.nextFunction = checkGuess;
                toggleVisibility(['guess', 'turnInfo2'], 'visible');
            }
        }
    };

}

var wheel = new WheelLogic();



