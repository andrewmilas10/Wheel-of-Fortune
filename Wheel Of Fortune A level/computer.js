
var ComputerPlayer = function() {
    var possWords = ['the', 'address', 'labels', 'antique', 'desk', 'lamp', 'baby', 'poweder', 'christmas', 'wreath', 'dust',  'bunnies', 'anne',
        'of', 'green', 'gables', 'pride', 'and', 'prejudice', 'wild', 'call', 'great', 'gatsby', 'chronicles', 'narnia', 'a', 'squeeze',
        'lemon', 'almond', 'milk', 'fresh', 'mozzarella', 'cheese', 'garlic', 'onions', 'jalapeno', 'peppers', 'no', 'muss', 'fuss', 'gruesome',
        'twosome', 'thin', 'edge', 'wedge', 'whale', 'tale', 'you', 'snooze', 'lose'];
    
    var possibleWords = function(knownPositions) {
        console.debug("computer selecting possible words");
        var newPossWords=[];
        //purpose of this for loop is to find which words are possible with the current guesses
        for (i=0;i<knownPositions.length;i++) {//scrolls through words of the phrase
            for (k=0; k<possWords.length;k++) {//scrolls through all possible words
                //the interior of this for loop adds the word to the array if its possible
                if (knownPositions[i].length===possWords[k].length) {//only checks words of possible length
                    var isPoss=true;
                    for (j=0; j<knownPositions[i].length;j++) {
                        if ((knownPositions[i].substr(j, 1) != '_') && 
                            (knownPositions[i].substr(j, 1) != possWords[k].substr(j, 1))) {
                            isPoss=false
                        }
                    }
                    if (isPoss) {
                        newPossWords.push(possWords[k])
                    }
                }
            }
        }
        console.debug("computer possible words:" + newPossWords);
        return newPossWords;
    };
    
    var getKnownPosittions = function(phrase) {
        console.debug("computer computing known posittions");
        var knownPositions = phrase.split('   ');
        
        for(i=0; i<knownPositions.length; i++) {
            knownPositions[i] = knownPositions[i].replace(/ /g, '');
        }
        console.debug("computer known positions:" + knownPositions);
        return knownPositions;        
    };

    var onlyVowelsLeft = function(knownPositions, phrase) {
        var phraseWords = phrase.split(' ');

        for (i=0;i<knownPositions.length;i++) {
            for (k = 0; k < knownPositions[i].length; k++){
                if (knownPositions[i].substr(k, 1) === '_' && 
                    ['a', 'e', 'i', 'o', 'u'].indexOf(phraseWords[i].substr(k, 1)) < 0) {
                    return false;
                }
            }
        }
        return true;
    }

    this.chooseLetter = function(game) {
        console.debug("computer chosing");
        var priorities=['t', 'e', 'n', "s", 'a', 'r', 'o', 'h', 'd', 'l', 'f', 'm', 'i', 'c', 'u', 'w', 'g', 'p', 'b', 'y', 'v', 'k', 'j', 'q', 'x', 'z'];
        var phrase = document.getElementById('phrase').innerHTML;
        var knownPositions = getKnownPosittions(phrase);
                
        if ( onlyVowelsLeft(knownPositions, phrase) ) {
            return phrase;
        }

        var newPossWords = possibleWords(knownPositions);
        
        for (i=0;i<priorities.length;i++) {
            var validLetter = false;
            for (k = 0; k < newPossWords.length; k++) {//checks to see if the letter is inside for any possible word
                if (newPossWords[k].indexOf(priorities[i]) >= 0) {
                    validLetter = true;
                }
            }
            
            if (phrase.match(/_/g).length / phrase.length > .4 && 
                newPossWords.length === knownPositions.length) {
                //doesn't narrow the guess with possible words, if the computer knows the word and at least 40% of the letters are underscores
                if ((game.guessedLetters.indexOf(priorities[i]) >= 0) || 
                    ((game.roundScores[game.playerIndex()] < 250) && 
                      (game.vowels.indexOf(priorities[i]) >= 0))) {//removes impossible letters
                    priorities[i] = ' ';
                }
            }
            else if ((!validLetter) || 
                     (game.guessedLetters.indexOf(priorities[i]) >= 0) || 
                     ( (game.roundScores[game.playerIndex()] < 250) && 
                       (game.vowels.indexOf(priorities[i]) >= 0))
                    ) {//removes impossible letters
                priorities[i] = ' ';
            }
        }

        while (priorities[0]===' ') {//finds the top prioritized letter that wasn't removed
            priorities.splice(0, 1);
        }
        
        return(priorities[0]);
    }


}

var computer = new ComputerPlayer();

