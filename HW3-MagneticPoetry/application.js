(function() {

  var RANDOM_POSITION_PADDING = 50;

  var board = document.getElementById('board');
  var add = document.getElementById('add');
  var text = document.getElementById('text');
  var deleteBox = document.getElementById('delete');

  var Magnet = function(text) {
    this.text = text;

    var el = document.createElement('button');
    this.el = el;
    el.appendChild(document.createTextNode(text));
    board.appendChild(el);

    this.randomPosition();

    var that = this;
    el.addEventListener('mousedown', function(event) {
      // Calculate the offset from the top-left corner
      var offsetX = event.clientX - that.x;
      var offsetY = event.clientY - that.y;

      var startX = event.clientX;
      var startY = event.clientY;

      showDeleteBox();

      var mouseMoveListener = function(event) {
        that.moveElement(event.clientX - offsetX, event.clientY - offsetY);
      };

      var mouseUpListener = function(event) {
        board.removeEventListener('mousemove', mouseMoveListener, false);
        el.removeEventListener('mouseup', mouseUpListener, false);
        
        // Check if it was dropped on the delete box
        var deleteRect = deleteBox.getBoundingClientRect();
        if (deleteRect.top < that.y && deleteRect.left < that.x) {
          el.parentNode.removeChild(el);
        }
        
        hideDeleteBox();
      };

      board.addEventListener('mousemove', mouseMoveListener, false);
      el.addEventListener('mouseup', mouseUpListener, false);
    }, false);
  };

  Magnet.prototype.randomPosition = function() {
    var width = this.el.offsetWidth;
    var height = this.el.offsetHeight;
    var boardWidth = board.offsetWidth;
    var boardHeight = board.offsetHeight;

    var maxX = boardWidth - width - (RANDOM_POSITION_PADDING * 2);
    var maxY = boardHeight - height - (RANDOM_POSITION_PADDING * 2);

    var x = Math.floor(Math.random() * maxX) + RANDOM_POSITION_PADDING;
    var y = Math.floor(Math.random() * maxY) + RANDOM_POSITION_PADDING;

    this.moveElement(x, y);
  };

  Magnet.prototype.moveElement = function(x, y) {
    this.x = x;
    this.y = y;

    this.el.style.left = x + 'px';
    this.el.style.top = y + 'px';
  };

  add.addEventListener('click', function() {
    if (text.value) {
      var words = text.value.split(' ');
      text.value = '';
      for (var i = 0; i < words.length; i++) {
        new Magnet(words[i]);
      }
    }
  }, false);

  var showDeleteBox = function() {
    deleteBox.style.right = 0;
    deleteBox.style.bottom = 0;
  };

  var hideDeleteBox = function() {
    deleteBox.style.right = null;
    deleteBox.style.bottom = null;
  };

})();
