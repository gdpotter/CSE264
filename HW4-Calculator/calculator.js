(function() {

  var LENGTH_LIMIT = 18;

  var calc = {
    display: document.getElementById('display'),
    numKeys: document.getElementsByClassName('num-key'),
    opKeys: document.getElementsByClassName('op-key'),
    keys: document.getElementsByClassName('key'),
    
    tree: null,
    currentNum: "",
    opStack: [],
    expression: [],
    lastOp: null,
    lastNum: null,

    init: function() {

      // Bind Numberkeys
      Array.prototype.forEach.call(calc.numKeys, function(key) {
        key.addEventListener('click', function(e) {
          calc.keyPress(e.target.innerHTML);
        }, false);
      });

      // Bind operation keys
      Array.prototype.forEach.call(calc.opKeys, function(key) {
        key.addEventListener('click', function(e) {
          calc.operation(e.target.innerHTML);
        }, false);
      });

      // Bind keyboard (backspace)
      document.addEventListener('keydown', function(e) {
        if (e.keyCode == 8) { // Handle Backspace
          e.preventDefault();
          calc.currentNum = calc.currentNum.slice(0, -1);
          calc.updateDisplay();
        }
      }, false);

      // Bind the rest of the keyboard
      document.addEventListener('keypress', function(e) {
        Array.prototype.forEach.call(calc.keys, function(key) {
          if (key.dataset.keycode == e.keyCode) {
            key.classList.add('active');
            setTimeout(function() {
              key.classList.remove('active');
            }, 100);
            key.click();
          }
        });
      }, false);

      // Bind decimal point key
      document.getElementById('decimal').addEventListener('click', function() {
        if (calc.currentNum.indexOf('.') < 0) {
          calc.currentNum = (calc.currentNum || "0") + '.';
          calc.updateDisplay();
        }
      }, false);

      document.getElementById('calculate').addEventListener('click', function() {
        calc.calculate();
      }, false);

      document.getElementById('plus-minus').addEventListener('click', function() {
        calc.plusMinus();
      }, false);

      document.getElementById('clear').addEventListener('click', function() {
        calc.clear();
      }, false);

      calc.updateDisplay();
    },
    updateDisplay: function() {
      var val;
      if (this.currentNum) {
        val = this.currentNum;
      } else if (!this.expression.length) {
        val = 0;
      } else {
        val = this.expression[this.expression.length - 1];
      }
      this.display.value = val;
    },
    keyPress: function(num) {
      if (calc.currentNum.length >= LENGTH_LIMIT) {
        return;
      }
      this.currentNum = (calc.currentNum == '0' ? '' : calc.currentNum) + num;
      this.updateDisplay();
    },
    operation: function(op) {
      if (!this.currentNum) {
        if (this.expression.length) {
          this.currentNum = this.expression.pop();
        } else {
          return;
        }
      }

      var num = parseFloat(calc.currentNum);
      this.expression.push(num);

      while (this.opStack.length && opValue(op) <= opValue(this.opStack[this.opStack.length - 1])) {
        var popped = this.opStack.pop();
        var b = this.expression.pop();
        var a = this.expression.pop();
        this.expression.push(operate(popped, a, b));
      }
      
      this.opStack.push(op);

      this.currentNum = '';
      this.updateDisplay();
    },
    calculate: function() {
      if (this.currentNum) {
        var num = parseFloat(calc.currentNum);
        this.expression.push(num);
      }
      if (!this.opStack.length) {
        if (this.lastNum && this.lastOp) {
          this.expression.push(this.lastNum);
          this.opStack.push(this.lastOp);
        } else {
          this.expression = [this.expression.pop()];
          return;
        }
      }

      this.lastOp = this.opStack[this.opStack.length - 1];
      this.lastNum = this.expression[this.expression.length - 1];

      while (this.opStack.length) {
        var popped = this.opStack.pop();
        var b = this.expression.pop();
        var a = this.expression.pop();
        this.expression.push(operate(popped, a, b));
      }

      this.expression = [this.expression.pop()];

      this.currentNum = '';
      
      this.updateDisplay();
    },
    clear: function() {
      this.currentNum = '';
      this.updateDisplay();
    },
    plusMinus: function() {
      if (this.currentNum) {
        this.currentNum *= -1;
      } else if (this.expression.length) {
        this.expression.push(this.expression.pop() * -1);
      } else {
        return;
      }
      this.updateDisplay();
    }
  };

  // Utility method to assign a numerical value to the
  // operators for ordering precedence
  var opValue = function(op) {
    if (op == '+' || op == '-') {
      return 1;
    } else if (op == '*' || op == '/') {
      return 2;
    } else {
      return 0;
    }
  };

  // Takes an operator (as a string) and two numbers and
  // performs the operator on them.
  var operate = function(op, a, b) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
    }
  };

  calc.init();

})();

