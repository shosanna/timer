$(document).ready(function () {
    var quotes = ["Whenever you are asked if you can do a job, tell them, \'Certainly I can!\' Then get busy and find out how to do it.",
        "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
        "If you spend too much time thinking about a thing, you'll never get it done."];

    // Quote changes every 10 seconds
    var quote_div = document.getElementById("quote");
    var i = 0;
    function changeQuote() {
        var sentence = quotes[i++ % quotes.length];
        quote_div.innerHTML = sentence;
    };
    changeQuote();
    setInterval(changeQuote, 10000);

    // Tasks are sortable
    $( "#sortable").sortable({
        revert: true
    });
    $( "ul, li" ).disableSelection();

    // Clicking done toggle class
    $(".done_action").click(function(){
       $(this).siblings(".task").toggleClass( "done", 1000 );
    });

    // Clicking active toggle class
    $(".active_action").click(function(){
        $(this).siblings(".task").toggleClass( "active", 500 );
    });
});

