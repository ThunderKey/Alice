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
    p.endPosition = p.x + distance;
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

  //sensors
  positionBlocks: function() {
    var positions = [];
    for(id in EnvironmentTracker.blocks) {
      var block = EnvironmentTracker.blocks[id];
      positions.push({x: block.x, y: block.y});
    }
    return positions;
  },
  positionHoles: function() {
    return EnvironmentTracker.gaps;
  },
  positionMe: function() {
    var p = EnvironmentTracker.player;
    return {x: p.x, y: p.y};
  },
  positionGoal: function() {
    var goal = EnvironmentTracker.finish;
    return {x: goal.x, y: goal.y};
  },

  death: function() {
    return EnvironmentTracker.player.dead;
  },
  win: function() {
    return EnvironmentTracker.player.won;
  },

  distanceToGoal: function() {
    var goal = this.positionGoal();
    var me = this.positionMe();
    return goal.x - me.x /*- me.width*/;
  },

  nearestBlock: function() {
    return this._nearestX(this.positionBlocks(), 'x');
  },

  nearestHole: function() {
    return this._nearestX(this.positionHoles(), 'startX');
  },

  _nearestX: function(items, key) {
    var nearest = null;
    var myX = this.positionMe().x;
    for(i in items) {
      var item = items[i];
      //every, not just in front
      //if(nearest == null || (myX - nearest.x > myX -item.x)) {
      if(item[key] > myX && (nearest == null || (nearest[key]) > (item[key]))) {
        nearest = item;
      }
    }
    return nearest;
  } 
};
