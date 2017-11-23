/*
 * Create a list that holds all of your cards
 */

var deck = [
    "fa fa-diamond",
    "fa fa-diamond",
    "fa fa-paper-plane-o",
    "fa fa-paper-plane-o",
    "fa fa-anchor",
    "fa fa-anchor",
    "fa fa-bolt",
    "fa fa-bolt",
    "fa fa-cube",
    "fa fa-cube",
    "fa fa-leaf",
    "fa fa-leaf",
    "fa fa-bicycle",
    "fa fa-bicycle",
    "fa fa-bomb",
    "fa fa-bomb"
]

var moves = 0;
var open = [];
var time;
var stars = 3;
var tiempo;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function printDeck(array) {
    var deck = $('#deck');
    deck.empty();
    for (const data of array) {
        deck.append(`
        <li class="card">
            <i class="` + data + `"></i>
        </li>`);
    }

}

function reset() {
    moves = 0;
    deck = shuffle(deck);
    printDeck(deck);
    printMove(moves);
    open = [];

}

function printMove(count) {
    $('.moves').text(count.toString());
}

function showCard(card) {

    $('.unshow').removeClass('unshow');
    var cardSelected = $(card).attr('class');

    if (cardSelected.includes('open')) {
        return false;
    }
    $(card).addClass("open show");
    return true;
}
function obtainCard(element) {
    return $(element).children('i').attr('class');
}

function addOpen(card) {
    var cardClass = obtainCard(card);
    open.push({ card: cardClass, match: false });

}

function countUnMatched() {
    var count = 0;

    open.forEach(function (element) {
        if (element.match === false) {
            count++;
        }
    });
    return count;
}


function findMatch(element) {
    var cardClass = obtainCard(element);
    var findUnMatched = false;
    var cardUnMatched;

    for (const card of open) {
        if (card.match === false) {
            findUnMatched = true;
            cardUnMatched = card;
            break;
        }
    }

    if (findUnMatched) {
        moves++;

        if (cardUnMatched.card == cardClass) {
            markMatch(cardClass);
        }
        else {
            unMarkCards(cardUnMatched.card, cardClass);
            hideCard(cardUnMatched.card, cardClass);
        }
    }

}

function hideCard(...cards) {
    for (const card of cards) {
        $('.' + card.replace(" ", ".")).parent('li.open.show').toggleClass('unmatch').toggleClass('open show');
    }
    setTimeout((cards) => {
        for (const card of cards) {
            $('.' + card.toString().replace(" ", ".")).parent('li.unmatch').toggleClass('unmatch').toggleClass('unshow');
        }
    }, 700, cards);


}

function markMatch(cardClass) {
    for (const card of open) {
        if (card.card == cardClass) {
            card.match = true;
        }
    }

    $('.' + cardClass.replace(" ", ".")).parent('li').addClass('match');
}

function unMarkCards(...cards) {

    for (const card of cards) {
        open.splice(open.indexOf(card), 1);
    }
}

deck = shuffle(deck);
printDeck(deck)

$('#deck').on("click", "li", function () {
    //Start the timer
    if (moves === 0 && open.length === 0) {
        time = new GameTimer();
        console.log(time);
        tiempo = setInterval(function(){
            $('.time-played').text(time.time());
        },500);
    }

    if (showCard(this)) {
        addOpen(this);
    }
    if (countUnMatched() > 1) {
        findMatch(this);
    }
    printMove(moves);
    won();
});

var won = function () {
    var allMatch = true;

    for (const card of open) {
        if (!card.match) {
            allMatch = false;
            break;
        }
    }

    if (allMatch && open.length === deck.length) {
        time.stopTimer(tiempo);
        let timeplayed = time.time_played;
        console.log(time);

        swal({
            title: 'Congratulations! You Won!',
            text: 'You got ' + stars + ' stars with ' + moves + ' moves. With the time of ' + timeplayed,
            type: 'success',
            confirmButtonText: 'Play Again'
        }).then(function (result) {
            if (result.value) {
                reset();
            }
        });

    }

}

/*Gamer Time*/
var GameTimer = function () {
    this.game_start_time = new Date().getTime();
    this.time_played = "";
}

GameTimer.prototype.time = function () {
    let current_time = new Date().getTime();
    let current_time_played = current_time - this.game_start_time; //calculate time elapsed

    let hrs = Math.floor((current_time_played % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let mins = Math.floor((current_time_played % (1000 * 60 * 60)) / (1000 * 60));
    let secs = Math.floor((current_time_played % (1000 * 60)) / 1000);

    //time_value = hrs + ' hours ' + mins + ' mins ' + secs + ' secs '; 

    if (secs < 10) {
        secs = '0' + secs;
    }

    if (mins < 10) {
        mins = '0' + mins;
    }

    if (hrs < 10) {
        hrs = '0' + hrs;
    }

    this.time_played = hrs + ':' + mins + ':' + secs;
    
   return this.time_played;

}

// function GameTimer() {
//     const game_start_time = new Date().getTime();
//     var time_played;


//     timer = 
  
// }

GameTimer.prototype.stopTimer = function (interval) {
    clearInterval(interval);
};


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
