/**
 * Created by tutumimi on 10/30/2016.
 */
//displays previously recorded game settings.
function setUpScreen() {
    settings.loadSettings();

    if ( !settings.hasPreviousStoredData ) {
        //this if sets default settings if no data from this page was previously recorded (note that data is deleted when the browser is closed).
        pick('phrase', 2, 5);
        pick('bonus', 1, 2);
        pick('player', 4, 5);
    }
    else {//displays previously recorded settings.
        pick('phrase', settings.amountOfPhrases, 5);
        pick('bonus', settings.isBonusRound ? 1: 2, 2);
        
        var names = settings.names;
        if (settings.isComputer) {//TODO: Finish Computer player
            pick('player',names.length, 5);
        }
        else {
            pick('player', names.length+2, 5);
        }
        for (i=1; i<=numOfPlayers; i++) {
            document.getElementById('input'+i).value=names[i-1];
        }
    }
}


var numOfPlayers;



//takes in a list of ids and a string set to 'visible' or 'hidden', setting each object's visibility to this sting
function toggleVisibility(ids, showOrHide) {
    for (i=0; i<ids.length; i++) {
        document.getElementById(ids[i]).style.visibility=showOrHide;
        }
}

//puts a border around the clicked text and removes borders from other texts in the same row. Creates variable based on what was clicked
function pick(id, idNumber, totalIds) {
    console.debug(id + " ix:" + idNumber + " of:" + totalIds);
    document.getElementById(id+idNumber).style.border='3px solid red';
    document.getElementById(id+idNumber).style.fontSize='30px';
    if (id==='bonus') {
        settings.isBonusRound=(idNumber===1);
    }
    if (id==='phrase') {
        settings.amountOfPhrases=idNumber;
    }
    if ((id==='player')&&(idNumber===1||idNumber===3)) {
        numOfPlayers=1;
        toggleVisibility(['p2', 'p3'], 'hidden');
    }
    else if ((id==='player')&&(idNumber===2||idNumber===4)) {
        numOfPlayers=2;
        toggleVisibility(['p3'], 'hidden');
        toggleVisibility(['p2'], 'visible');
    }
    else if (id==="player") {
        numOfPlayers=3;
        toggleVisibility(['p2', 'p3'], 'visible');
    }
    for (i=1; i<=totalIds; i++) {//unborders all other texts in the row
        if (idNumber!=i) {
            document.getElementById(id+i).style.border='3px hidden red';
            document.getElementById(id+i).style.fontSize='25px';
            if (id==='player') {
                settings.isComputer = (idNumber === 1 || idNumber === 2);
                document.getElementById(id + i).style.border = '3px hidden red';
                document.getElementById(id + idNumber).style.fontSize = '25px';
                document.getElementById(id + i).style.fontSize = '20px';
            }
        }
    }
}

setTimeout(setUpScreen, 100); //waits to allow html and css to run first
