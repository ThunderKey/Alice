API = {
  //actors
  walkLeft: function(distance, callback) {
    return this.walk(0 - distance, callback);
  },
  walkRight: function(distance, callback) {
    return this.walk(distance, callback);
  },
  // distance < 0 => going left, else going right
  walk: function(distance, callback) {
    var k = {key: Crafty.keys[distance < 0 ? "LEFT_ARROW" : "RIGHT_ARROW"]};
    var p = EnvironmentTracker.player;
    p.endPosition = p.x + this._distanceToPx(distance);
    p.endPosCallback = function() {
      p.trigger('KeyUp', k);
      callback();
    }

    p.trigger('KeyDown', k);
    return this;
  },

  jumpLeft: function(callback) {
    this.jump('l', callback);
  },
  jumpRight: function(callback) {
    this.jump('r', callback);
  },
  // direction is 'l' or 'r'
  jump: function(direction, callback) {
    var p = EnvironmentTracker.player;
    
    var sideKey = {key: Crafty.keys[direction == 'l' ? "LEFT_ARROW" : "RIGHT_ARROW"]};

    p.jumpCallback = function() {
      p.trigger('KeyUp', sideKey);
      callback();
    }

    p.trigger('KeyDown', sideKey);
    p._up = true; 
  },

  _pxToDistance: function(pixel) {
    return pixel / 50;
  },
  _distanceToPx: function(distance) {
    return distance * 50;
  }
};
