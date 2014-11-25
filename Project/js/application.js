$(function() {
    
    var cardsDir = "images/CARDS/";
    
    var images = [];
    
    function preloadImages() {
        for (var i = 0; i < 52; i++) {
            images.push($('<img />').attr('src', cardsDir + i + ".png"));
        }
    }
   
    function displayHand(hand) {
        var handDiv = $('#hand');
        handDiv.empty();
        hand.forEach(function(card) {
            handDiv.append(images[card].clone());
        });
        $('#hand img').draggable();
    }
    
    
    preloadImages();
    $('#drop').droppable({
        drop: function(e, ui) {
            $(this).append(ui.draggable.css({position: 'static'}));
        }
    });
    
    // For testing:
    displayHand([36, 19, 22, 5]);
    
});