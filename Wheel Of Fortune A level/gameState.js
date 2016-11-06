

var GameState = function() {
    var choices = [
            ['Around the house', 
                'address labels', 'antique desk lamp', 'baby powder', 'christmas wreath', 'dust bunnies'],
            ['Book Titles', 
                'anne of green gables', 'pride and prejudice', 'the call of the wild', 'the great gatsby', 'the chronicles of narnia'],
            ['Food and Drink',
                'a squeeze of lemon', 'almond milk', 'fresh mozzarella cheese', 'garlic and onions', 'jalapeno peppers'],
            ["Rhyme Time", 
                'no muss no fuss', 'gruesome twosome', 'thin edge of the wedge', 'whale of a tale', 'you snooze you lose']];

    this.consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    this.vowels = ['a', 'e', 'i', 'o', 'u'];

    this.validLetters = this.consonants;
    this.letterType = "consonant"; //consonant or vowel
    this.guessedLetters = [' '];
    this.currentGuess = '';
    this.scores = [];
    this.roundScores = [];  //score for current round
    this.names = []; //players names list
    this.whoseTurn = Math.trunc(Math.random()*this.names.length);  //index for current player    
    this.currentRound = 1;
    this.phrase = "";
    this.nextFunction = null;

    this.playerName = function() {
        return this.names[this.whoseTurn % this.names.length];
    }
    this.playerIndex = function() {
        var ix  = this.whoseTurn % this.names.length;
        console.debug("whoseTurn:" + this.whoseTurn + "  playerIndex:" + ix);
        return ix;
    }
    this.roundScoreForPlayer = function() {
        return this.roundScores[this.playerIndex()];
    }
    this.getRandomCategory = function() {
        return choices[Math.trunc(Math.random() * choices.length)];
    }
    this.getRandomPhrase = function(category) {
        return category[Math.trunc(Math.random() * (category.length-1))+1];
    }
};

var game = new GameState();

