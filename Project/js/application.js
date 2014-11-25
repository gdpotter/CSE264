$(function() {
    
    var cardsDir = "images/CARDS/";
    var serverUrl = "http://tertullian.cse.lehigh.edu:3200/";
    
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
        $('#hand img').draggable({
            revert: 'invalid'
        });
    }
    
    function displayPlayers(players) {
        var playerList = $('#players tbody').empty();
        players.forEach(function(player) {
            var playerRow = $('<tr/>').html('<td>' + player.name + '</td><td>' + player.score + '</td>');
            if (player.one) {
                playerRow.addClass('one');
            }
            playerList.append(playerRow)
        });
    }
    
    function displayCard(card) {
        $('#drop').empty().append(images[card]);
    }
    
    function enableDisable(el, enable) {
        if (enable) {
            el.removeAttr('disabled');
        } else {
            el.attr('disabled', '');
        }
    }
    
    function enableSuits(enable) {
        enableDisable($('.suit-button'), enable);
    }
    
    function enableReverseSkip(enable) {
        enableDisable($('#reverse, #skip'), enable);
    }
    
    function enableDraw(enable) {
        enableDisable($('#draw'), enable);
    }
    
    function enableOne(enable) {
        enableDisable($('#one'), enable);
    }
    
    function setSuit(suit) {
        console.log('SUIT: ' + suit);
    }
    $('.suit-button').click(function() {
        setSuit($(this).data('suit'));
    });
    
    function setReverse() {
        console.log('REVERSE');
    }
    $('#reverse').click(setReverse);
    
    function setSkip() {
        console.log('SKIP');
    }
    $('#skip').click(setSkip);
    
    function setDraw() {
        console.log('DRAW');
    }
    $('#draw').click(setDraw);
    
    function setOne() {
        console.log('ONE');
    }
    $('#one').click(setOne);
    
    function displayMessage(message) {
        $('#message').html(message);
    }
    
    
    
    
    
    preloadImages();
    
    $('#drop').droppable({
        drop: function(e, ui) {
            $(this).empty().append(ui.draggable.css({position: 'static'}));
        }
    });
    
    // For testing:
    displayHand([36, 19, 22, 5]);
    enableSuits(false);
    enableReverseSkip(false);
    enableDraw(false);
    enableOne(false);
    displayPlayers([
        { name: 'Bob Smith', score: 150, one: false },
        { name: 'James Femister', score: 72, one: true },
        { name: 'Greg Potter', score: 18, one: false }
    ]);
    displayCard(42);
    displayMessage('<b>Lorem ipsum dolor sit amet</b>, consectetur adipiscing elit. ' +
            'Aenean id purus ac libero <i>sollicitudin</i> porttitor. Sed in magna ' +
            'vel sapien sagittis porta.');
    
});