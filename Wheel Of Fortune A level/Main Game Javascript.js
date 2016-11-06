/**
 * Created by tutumimi on 10/23/2016.
 */


//edits the phrase to be guessed by adding correctly guessed letters where they belong and underscores for unguessed letters.
//takes in a letter that is wanted to be counted, and returns how many time the letter is in the phrase.
function editPhrase(guess) {
    var numOfTimes = 0;
    var build = '';
    for (i=0; i<game.phrase.length; i++) { //loops through letters in the phrase
        if (game.guessedLetters.indexOf(game.phrase.substr(i, 1)) >= 0) { //executes if the letter was guessed
            if (game.phrase.substr(i, 1)===' ') { //this if's purpose is to add more than one space when a space is found
                build+='  ';
            }
            build+=' '+game.phrase.substr(i, 1);
            if (game.phrase.substr(i, 1)===guess) { //checks whether the letter was the one being counted
                numOfTimes+=1;
            }
        }
        else { // puts an underscore if a letter was not found
            build += ' _';
        }
    }
    document.getElementById('phrase').innerHTML=build;
    return numOfTimes;
}


//Loops through each name and each score, displaying them in a paragraph
function updateScores() {
    document.getElementById('roundScores').innerHTML = 'Round Scores:     ';
    document.getElementById('scores').innerHTML = 'Total Scores:     ';
    for (i=0; i<game.names.length; i++) {
        document.getElementById('roundScores').innerHTML+=game.names[i]+": $"+game.roundScores[i]+"     ";
        document.getElementById('scores').innerHTML+=game.names[i]+": $"+(game.scores[i]+game.roundScores[i])+"     ";
    }
}

//takes in a list of ids and a string set to 'visible' or 'hidden', setting each object's visibility to this string
function toggleVisibility(ids, showOrHide) {
    for (i=0; i<ids.length; i++) {
        document.getElementById(ids[i]).style.visibility=showOrHide;
        if ((ids[i]==='nextTurn')||(ids[i]==='playAgain')||(ids[i]==='nextRound')||(ids[i]==='guess')||(ids[i]==='startBonus')||(ids[i]==='continue')) {
            //relocates the above objects for formatting reasons
            document.getElementById(ids[i]).style.top=document.getElementById('spinWheel').offsetTop+'px';
        }
    }
}

//takes in inputted names from the names and rounds page and gives each player a score
function getNamesAndScores() {
    game.names = settings.names;
    if (settings.isComputer) {
        game.names.push('Computer')
    }
    // alert(game.names);
    game.roundScores=[];
    for (i=0; i<game.names.length; i++) {
        game.roundScores.push(0);
    }
    if (game.scores[0]===undefined) {//doesn't create scores array if there already is one
        for (i = 0; i < game.names.length; i++) {
            game.scores.push(0);
        }
    }
    updateScores();
}

//called when the page is loaded.
//chooses and displays a phrase, gets and displays names and scores, and starts a person's turn
function start() {
    toggleVisibility(['playAgain', 'startBonus', 'nextRound', 'nextTurn', 'turnInfo2', 'spinWheel', 'buyVowel', 'solvePuzzle', 'bonusInfo',
        'bonusInfo2', 'bonusGuess', "scoresForBonus", 'letter1', 'letter2', 'letter3', 'letter4', 'bonusSubmit', 'guess', 'continue'], 'hidden');
    toggleVisibility(['restart', 'wheel', 'frame'], 'visible');
    
    //load isComputer, isBonusRound, names, amountOfPhrases
    settings.loadSettings();
    
    document.getElementById('round').innerHTML='Round '+game.currentRound+' out of '+ settings.amountOfPhrases;
    var category = game.getRandomCategory();
    document.getElementById('category').innerHTML='Category: '+category[0];
    game.phrase = game.getRandomPhrase(category);
    editPhrase('There is no guess');
    
    getNamesAndScores();
    game.whoseTurn=Math.trunc(Math.random()*game.names.length);
    startTurn()
}

//This function is called when a new person's turn has started..
// It tells a person it is their turn and gives them the option of spinning, buying a vowel, or solving the puzzle
function startTurn() {
    document.getElementById('turnInfo').innerHTML=game.playerName()+", it's your turn. Would you like to " +
        "spin the wheel, buy a vowel, or solve the puzzle.";
    toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle', 'turnInfo'], 'visible');
    toggleVisibility(['nextTurn'], 'hidden');

    if ((settings.isComputer) && (game.playerIndex() === game.names.length-1)) { //goes if its the computer's turn
        document.getElementById('turnInfo').innerHTML= "It's time for me, the great computer, to go.";
        toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle'], 'hidden');
        game.currentGuess = computer.chooseLetter(game);
        console.log("currentGuess:" + game.currentGuess);
        if (game.vowels.indexOf(game.currentGuess)>=0) {  //computer buys a vowel
            document.getElementById('turnInfo').innerHTML+= " I will buy the vowel "+game.currentGuess+".";
            document.getElementById('continue').onclick=checkGuess;
            game.roundScores[game.playerIndex()]-=250;
            updateScores();
            game.letterType='vowel';
            game.validLetters = game.vowels;
        }
        else if (game.consonants.indexOf(game.currentGuess)>=0) { //computer spins the wheel
            document.getElementById('turnInfo').innerHTML+= " I will spin the wheel.";
            document.getElementById('continue').onclick=wheel.spinWheel;
        }
        else {
            document.getElementById('turnInfo').innerHTML+= " I will guess that the phrase is "+game.currentGuess+".";
            document.getElementById('continue').onclick=solvePuzzlePart2;
        }
        toggleVisibility(['continue'], 'visible');
    }
}

var spinTheWheel = wheel.spinWheel;

//puts the contents of the input in a gobal variable and runs a previously chosen function
function giveInfo(event) {
    if ((event.which || event.keyCode)===13) {
        game.currentGuess=document.getElementById('guess').value.toLowerCase().replace(/ /g, '');
        game.nextFunction()
    }
}


//Alerts the player of a valid unguessed guess and waits for a new guess. When a valid guss is chosen it acts according
// to whether the guess was in the phrase or whether a vowel/consonant was guessed.
function checkGuess() {
    toggleVisibility(['turnInfo2'], 'visible');
    if (game.validLetters.indexOf(game.currentGuess) < 0) {//guess isn't valid
        document.getElementById('turnInfo2').innerHTML = "Please guess a " + game.letterType + ".";
    }
    else if (game.guessedLetters.indexOf(game.currentGuess) >= 0) {//guess was already guessed
        document.getElementById('turnInfo2').innerHTML = "You already guessed that " + game.letterType + ". Guess a different one.";
    }
    else {
        document.getElementById('turnInfo2').innerHTML = "";
        document.getElementById('guess').value = "";
        toggleVisibility(['guess', 'turnInfo2', 'continue'], 'hidden');
        game.guessedLetters.push(game.currentGuess);
        var numOfTimes = editPhrase(game.currentGuess); //fills in the phrase with the new guess recorded
        if (numOfTimes === 0) { //executes if the letter wasn't in the phrase.
            document.getElementById('turnInfo').innerHTML = "Unfortunately, that letter isn't in the word, marking the end of your turn.";
            if ((settings.isComputer)&&(game.playerIndex()===game.names.length-1)) {
                document.getElementById('turnInfo').innerHTML="No way, the letter NEVER appeared.";
            }
            game.whoseTurn += 1;
            toggleVisibility(['nextTurn'], 'visible');
        }
        else {
            // game.guessedLetters.push('b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z', 'a', 'e', 'i', 'o', 'u');
            // editPhrase('no guess');        //quickly gets to bonus round for testing purposes
            toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle'], 'visible');
            if (game.letterType === 'consonant') {//executes if guess was a successful consonant
                document.getElementById('turnInfo').innerHTML += "<br><br>That letter appeared " + numOfTimes + ' times, increasing your score by $' + numOfTimes * wheel.wheelAmount() + '.';
                if ((settings.isComputer)&&(game.playerIndex()===game.names.length-1)) {
                    document.getElementById('turnInfo').innerHTML="Aha, that letter appeared "+numOfTimes+' times, increasing my score by $' + numOfTimes * wheel.wheelAmount() + '.';
                    toggleVisibility(['continue'], 'visible');
                    toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle'], 'hidden');
                    document.getElementById('continue').onclick=startTurn;
                }
                game.roundScores[game.playerIndex()] += numOfTimes * wheel.wheelAmount();
                updateScores();
            }
            else { //executes if guess was a successful vowel
                document.getElementById('turnInfo').innerHTML = "That letter appeared " + numOfTimes + ' times.';
                if ((settings.isComputer) && (game.playerIndex() === game.names.length - 1)) {
                    document.getElementById('turnInfo').innerHTML = "Aha, that letter appeared " + numOfTimes + ' times.';
                    toggleVisibility(['continue'], 'visible');
                    toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle'], 'hidden');
                    document.getElementById('continue').onclick = startTurn;
                }
            }
            if ((checkWinner()===false)&&!((settings.isComputer)&&(game.playerIndex()===game.names.length-1))) {//executes if the phrase isn't complete
                    document.getElementById('turnInfo').innerHTML += "<br>What would you like to do next?";
            }
        }

    }
}

//Alerts the player if he can't buy a vowel. Otherwise it allows the person to make a guess.
function buyVowel() {
    if (game.roundScores[game.playerIndex()] < 250) { //Tells the person he can't buy a vowel with that score.
        document.getElementById('turnInfo').innerHTML = "You can't buy a letter; you need $250 for this round. Choose one of the other options instead.";
    }
    else {
        toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle'], 'hidden');
        game.roundScores[game.playerIndex()]-=250;
        updateScores();
        game.letterType='vowel';
        game.validLetters = game.vowels;
        document.getElementById('turnInfo').innerHTML="";
        document.getElementById('turnInfo2').innerHTML="What "+game.letterType+" do you want to guess? Press enter to submit the value in the input box below.";
        game.nextFunction=checkGuess;
        toggleVisibility(['guess', 'turnInfo2'], 'visible');
    }
}

//Allows the person to make a guess
function solvePuzzle() {
    document.getElementById('turnInfo').innerHTML="What do you think is the phrase? Press enter to submit your solution";
    toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle'], 'hidden');
    toggleVisibility(['guess', 'turnInfo'], 'visible');
    game.nextFunction=solvePuzzlePart2;
}

//Acts accordingly to whether a guess was correct or not
function solvePuzzlePart2() {
    document.getElementById('turnInfo2').innerHTML = "";
    document.getElementById('guess').value = "";
    toggleVisibility(['guess', 'turnInfo2'], 'hidden');
    if (game.currentGuess === game.phrase.replace(/ /g, '')) { //correct guess
        document.getElementById('turnInfo').innerHTML = "That's correct.";
        game.guessedLetters.push('b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z', 'a', 'e', 'i', 'o', 'u');
        editPhrase("there is no guess");
        if ((settings.isComputer) && (game.playerIndex() === game.names.length - 1)) {
            document.getElementById('turnInfo').innerHTML = "Yes, I was correct.";
        }
        checkWinner();
    }
    else {//incorrect guess
        document.getElementById('turnInfo').innerHTML = "Unfortunately, that isn't the phrase, marking the end of your turn.";
        game.whoseTurn += 1;
        toggleVisibility(['nextTurn'], 'visible');
    }
}

//checks to see if the phrase is complete, and if so alerts the winner and returns true. Otherwise returns false.
function checkWinner() {
    if (document.getElementById('phrase').innerHTML.indexOf('_') < 0) {//executes if the phrase is complete with no underscores
        toggleVisibility(['spinWheel', 'buyVowel', 'solvePuzzle', 'continue'], 'hidden');
        if ((settings.isComputer)&&(game.playerIndex()===game.names.length-1)) {
            document.getElementById('turnInfo').innerHTML += "<br>Woah, I, the awesome computer, just completed the word ";
        }
        else {
            document.getElementById('turnInfo').innerHTML += "<br>Woah, you, " + game.playerName() + ", just completed the word ";
        }
        for (i=0; i<game.names.length; i++) {//adds all of the round scores to the total scores
            game.scores[i]+=game.roundScores[i]
        }
        if (game.currentRound != settings.amountOfPhrases) {//executes if there are more rounds to be played
            document.getElementById('turnInfo').innerHTML += "and round "+game.currentRound+".";
            game.currentRound+=1;
            toggleVisibility(['nextRound'], 'visible');
        }
        else { //executes if this was the last round
            document.getElementById('turnInfo').innerHTML += "and round "+game.currentRound+", the final round.";
            var winner = [0];
            for (i = 1; i < game.names.length; i++) {//scrolls through each player to see who has the most points
                if (game.scores[i] > game.scores[winner[0]]) {
                    winner = [i];
                }
                else if (game.scores[i] === game.scores[winner[0]]) { //checks for ties
                    winner.push(i)
                }
            }
            if (winner.length === 3) { //alerts if a three-way tie occurred
                document.getElementById('turnInfo').innerHTML += "<br>Also, there is a tie, each person with  " + game.scores[winner[0]] + " dollars, between " + game.names[winner[0]] + ", " + game.names[winner[1]] + ", and " + game.names[winner[2]] + '.';
            }
            else if (winner.length === 2) {//alerts if a two-way tie occurred
                document.getElementById('turnInfo').innerHTML += "<br>Also, there is a tie, each person with  " + game.scores[winner[0]] + " dollars, between " + game.names[winner[0]] + " and " + game.names[winner[1]] + '.';
            }
            else {//alerts the winner
                if ((settings.isComputer)&&(winner[0]===game.names.length-1)) {
                    document.getElementById('turnInfo').innerHTML += "<br>Furthermore, I, the great computer with $"+game.scores[winner[0]] + ", won.";
                }
                else {
                    document.getElementById('turnInfo').innerHTML += "<br>Also, the winner, with " + game.scores[winner[0]] + " dollars, is " + game.names[winner[0]];
                }
            }
            if ((winner.length>1)&&(settings.isBonusRound)) {//tells that a bonus round can't be played because of a tie
                document.getElementById('turnInfo').innerHTML += "<br>However, because of this tie, a bonus round can't be played.";
                toggleVisibility(['playAgain'], 'visible');
            }
            else if (settings.isComputer&&settings.isBonusRound&&winner[0]===game.names.length-1) {
                document.getElementById('turnInfo').innerHTML += "<br>However, even though I won, I think I will skip the bonus Round. It's better to spare you the anger of watching me win 1000 more dollars.";
                toggleVisibility(['playAgain'], 'visible');
            }
            else if(settings.isBonusRound) { //starts the bonus round with the winner
                document.getElementById('turnInfo').innerHTML += ", who will get to play the bonus round.";
                game.whoseTurn=winner[0];
                toggleVisibility(['startBonus'], 'visible');
            }
            else {//bonus round option wasn't chosen
                document.getElementById('turnInfo').innerHTML += ".";
                toggleVisibility(['playAgain'], 'visible');
            }
        }
        return true
    }
    return false
}

//Chooses a category and guess for the bonus round, tells them the rules of the bonus round, hides all normal-round objects,
// and allows the player to choose their consonants and vowel.
function bonusRound() {
    toggleVisibility(['playAgain', 'nextRound', 'nextTurn', 'spinWheel', 'wheel', "frame", 'buyVowel', 'solvePuzzle', 'turnInfo', 'turnInfo2', 'startBonus', 'roundScores', 'scores'], 'hidden');
    toggleVisibility(['bonusInfo', 'scoresForBonus', 'letter1', 'letter2', 'letter3', 'letter4', 'bonusSubmit'], 'visible');
    document.getElementById('section2').style.display='none';
    document.getElementById('section3').style.display='none';
    document.getElementById('roundScores').style.display='none';
    document.getElementById('scores').style.display='none';
    document.getElementById('playAgain').style.display='none';
    document.getElementById('bonusInfo').innerHTML='A random phrase and category has been chosen for you with all instances of r, s, t, l, n, and e being displayed. ' +
        "You must now guess three more consonants and one more vowel. After pressing the 'submit letters' button, " +
        "the instances of these letters will also be revealed, and immediately after, you will have 20 seconds to type the phrase and hit enter.";
    document.getElementById('round').innerHTML='Bonus Round';
    var category = game.getRandomCategory();
    document.getElementById('category').innerHTML='Category: '+category[0];
    game.phrase = game.getRandomPhrase(category);
    game.guessedLetters=[' ', 'r', 's', 't', 'l', 'n', 'e'];
    editPhrase('There is no guess');
    document.getElementById('scoresForBonus').innerHTML=document.getElementById('scores').innerHTML;
}

//alerts the player of invalid guesses. Otherwise, reveals instances of the guesses, allows the player to guess the phrase, and starts the countdown
function submit() {
    game.guessedLetters=[' ', 'r', 's', 't', 'l', 'n', 'e'];
    game.letterType='consonant';
    game.validLetters = game.consonants;
    for (i=1; i<=4; i++) {
        var guess=document.getElementById('input'+i).value.toLowerCase().replace(/ /g, '');
        if (i===4) {
            game.letterType='vowel';
            game.validLetters = game.vowels;
        }
        if (game.validLetters.indexOf(guess) < 0) {//invalid guess
            if (game.letterType==='consonant') {
                document.getElementById('letter'+i).innerHTML=document.getElementById('letter'+i).innerHTML.substr(0, 11)+"(Please guess a "+game.letterType+"): <input id='input"+i+"' type='text'>";
            }
            else {
                document.getElementById('letter'+i).innerHTML=document.getElementById('letter'+i).innerHTML.substr(0, 5)+"(Please guess a "+game.letterType+"): <input id='input"+i+"' type='text'>";
            }
            document.getElementById('letter'+i).style.color='red';
        }
        else if (game.guessedLetters.indexOf(guess) >= 0) {//already guessed guess
            if (game.letterType==='consonant') {
                document.getElementById('letter' + i).innerHTML = document.getElementById('letter' + i).innerHTML.substr(0, 11) + "(You already guessed that " + game.letterType + "): <input id='input" + i + "' type='text'>";
            }
            else {
                document.getElementById('letter' + i).innerHTML = document.getElementById('letter' + i).innerHTML.substr(0, 7) + "(You already guessed that " + game.letterType + "): <input id='input" + i + "' type='text'>";
            }
            document.getElementById('letter'+i).style.color='red';
        }
        else {//valid guess
            document.getElementById('letter'+i).innerHTML = game.letterType+": <input id='input"+i+"' type='text'>";
            if (game.letterType==='consonant') {
                document.getElementById('letter'+i).innerHTML = game.letterType+" "+i+": <input id='input"+i+"' type='text'>";
            }
            game.guessedLetters.push(guess);
            document.getElementById('letter'+i).style.color='gold';
        }
        document.getElementById('input'+i).value=guess;
    }
    if (game.guessedLetters.length===11) {//if all the guesses were valid
        editgame.phrase('there is no guess');
        toggleVisibility(['letter1', 'letter2', 'letter3', 'letter4', 'bonusSubmit'], 'hidden');
        toggleVisibility(["bonusGuess", "bonusInfo2", "bonusGuess"], 'visible');
        document.getElementById('bonusInfo').innerHTML='You will now have 15 seconds to guess the phrase (press enter to submit). <br>Seconds Remaining: '+seconds;
        seconds=15;
        toClear=setInterval(countDown, 1000); //countdown
    }
}
var toClear;
//sets entered guess into a global variable and calls another function to check it
function giveBonusInfo(event) {
    if ((event.which || event.keyCode)===13) {
        game.currentGuess=document.getElementById('inputFin').value.toLowerCase().replace(/ /g, '');
        bonusGuess();
    }
}

//checks whether the guess was correct. If so the function awards money,  acknowledges the win, and gives option to play again.
function bonusGuess() {
    if (game.currentGuess === game.phrase.replace(/ /g, '')) {//correct guess
        clearInterval(toClear);
        document.getElementById('bonusInfo').innerHTML = "That's correct, meaning that you, "+game.playerName()+" won the extra $1000 dollar prize.";
        document.getElementById('bonusInfo2').innerHTML='';
        toggleVisibility(['bonusGuess', 'bonusInfo2'], 'hidden');
        document.getElementById('bonusGuess').value="";
        game.scores[game.playerIndex()]+=1000;
        updateScores();
        document.getElementById('scoresForBonus').innerHTML=document.getElementById('scores').innerHTML;
        game.guessedLetters.push('b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z', 'a', 'e', 'i', 'o', 'u');
        editPhrase("there is no guess");
        document.getElementById('playAgain').style.display='block';
        toggleVisibility(['playAgain'], 'visible');
        document.getElementById('playAgain').style.top=document.getElementById('bonusGuess').offsetTop+'px';
    }
    else {
        document.getElementById('bonusInfo2').innerHTML = "That is incorrect.";
    }
}
var seconds=15;
//repeatedly shows how many seconds remain. If the player if he loses
function countDown() {
    document.getElementById('bonusInfo').innerHTML='You will now have 15 seconds to guess the phrase (press enter to submit). <br>Seconds Remaining: '+seconds;
    seconds-=1;
    if (seconds===-1) {//time's up
        document.getElementById('bonusInfo').innerHTML="Ooh, time is over, so you don't get the $1000 prize. The correct phrase was "+game.phrase +".";
        game.guessedLetters.push('b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z', 'a', 'e', 'i', 'o', 'u');
        editPhrase("there is no guess");
        toggleVisibility(['playAgain'], 'visible');
        document.getElementById('playAgain').style.display='block';
        toggleVisibility(['bonusGuess', 'bonusInfo2'], 'hidden');
        document.getElementById('bonusGuess').value="";
        document.getElementById('playAgain').style.top=document.getElementById('bonusGuess').offsetTop+'px';
        clearInterval(toClear)
    }
}
//restarts the game by resetting all changeable global variables and all displayed text, and then calling the start function.
function restart(newGame) {
    document.getElementById('section2').style.display='block';
    document.getElementById('section3').style.display='block';
    document.getElementById('roundScores').style.display='block';
    document.getElementById('scores').style.display='block';
    document.getElementById('playAgain').style.display='block';
    toggleVisibility(['roundScores', 'scores'], 'visible');
    toggleVisibility(['bonusInfo', 'bonusInfo2', 'bonusGuess', "scoresForBonus", "guess", 'letter1', 'letter2', 'letter3', 'letter4', 'bonusSubmit'], 'hidden');

    if (newGame) {
        game.currentRound=1;
        game.scores=[];
    }
    game.guessedLetters = [' '];
    wheel.counter=0;
    document.getElementById('wheel').style.transform = 'rotate(' + wheel.counter + 'deg)';

    document.getElementById('phrase').innerHTML="";
    document.getElementById('category').innerHTML="";
    document.getElementById('turnInfo').innerHTML="";
    document.getElementById('turnInfo2').innerHTML="";
    document.getElementById('scores').innerHTML="";
    document.getElementById('scoresForBonus').innerHTML="";
    document.getElementById('bonusInfo').innerHTML="";
    document.getElementById('bonusInfo2').innerHTML="";
    start();
}


setTimeout(start, 100);
