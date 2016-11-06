var GameSettings = function() {
    this.isBonusRound = true;
    this.names  =  [];
    this.isComputer = false;
    this.amountOfPhrases = 1;
    this.hasPreviousStoredData = false; 

    this.loadSettings = function() {
        console.debug("load cookie: " + document.cookie);
        var names = getCookie('names');
        if (names !== '') {    
            this.hasPreviousStoredData = true;
            this.isBonusRound = getCookie('isBonusRound')==='true';
            this.names = names.split(',');
            this.isComputer = getCookie('isComputer')==='true';
            this.amountOfPhrases = getCookie('amountOfPhrases');
        }
    };

    //stores variables created on this page into cookies for the next page
    this.storeSettings = function() {
        this.names=[];
        for (i=1; i<=numOfPlayers; i++) {
            this.names.push(document.getElementById('input'+i).value);
        }
        document.cookie="names=" + this.names;
        document.cookie="isComputer=" + this.isComputer;
        document.cookie="isBonusRound=" + this.isBonusRound;
        document.cookie="amountOfPhrases=" + this.amountOfPhrases;

        console.debug("save cookie: " + document.cookie);
    };

    //takes in the left hand side of a cookie equation from the list of equations document.cookie returns.
    //returns the right hand side of the specified equation..
    var getCookie = function(cookieName) {
        var cookieArray = document.cookie.split(';');   //puts all the equations in an array
        for(var i = 0; i <cookieArray.length; i++) {  //loops through the array
            var cookie = cookieArray[i];
            while (cookie.charAt(0)==' ') {  //removes any beginning whitespaces
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName+"=") === 0) {  //checks to see if the current cookie equation is the desired one
                return cookie.substring(cookieName.length+1,cookie.length);
            }
        }
        return "";
    }
};

var settings = new GameSettings();
