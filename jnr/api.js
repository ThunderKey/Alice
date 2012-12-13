API = {
  // **********
  // * actors *
  // **********

  walkLeft: function(callback, distance) {
    return this.walk(callback, 0 - distance);
  },
  walkRight: function(callback, distance) {
    return this.walk(callback, distance);
  },
  // distance < 0 => going left, else going right
  walk: function(callback, distance) {
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

  jumpLeft: function(callback, distance) {
    this.jump(callback, 0 - distance);
  },
  jumpRight: function(callback, distance) {
    this.jump(callback, distance);
  },
  jumpUp: function(callback, numberOfBlocks) {
    this.jump(callback, 50, (numberOfBlocks <= 1 ? 1 : 2) * 50);
  },
  // distance < 0 => going left, else going right
  jump: function(callback, distance, height) {
    var _callback = function() {
      if(firstTime) {
        firstTime = false;
      } else {
        p.trigger('KeyUp', {key: Crafty.keys.LEFT_ARROW});
        p.trigger('KeyUp', {key: Crafty.keys.RIGHT_ARROW});
        p.trigger('KeyUp', sideKey);

        callback();
      }
    }

    var p = EnvironmentTracker.player;
    var firstTime = true;

    var sideKey = {key: Crafty.keys[distance < 0 ? "LEFT_ARROW" : "RIGHT_ARROW"]};

    p.endPosition = p.x + distance;
    p.endPosCallback = _callback;

    p.jumpCallback = _callback;

    if(height != null) {
      p.endHeight = p.y - height;
      p.endHeightCallback = function() {
        p.trigger('KeyDown', sideKey);
      }
    } else {
      p.trigger('KeyDown', sideKey);
    }

    p._up = true; 
  },

  // ***********
  // * sensors *
  // ***********
  
  positionBlocks: function() {
    var positions = [];
    for(id in EnvironmentTracker.blocks) {
      positions.push(this._getPosition(EnvironmentTracker.blocks[id]));
    }
    return positions;
  },
  positionHoles: function() {
    return EnvironmentTracker.gaps;
  },
  positionMe: function() {
    return this._getPosition(EnvironmentTracker.player);
  },
  positionGoal: function() {
    var goal = EnvironmentTracker.finish;
    return this._getPosition(goal);
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
    return goal.x - me.x - me.w;
  },

  nearestBlock: function() {
    return this._nearestX(this.positionBlocks(), 'x');
  },

  nearestHole: function() {
    return this._nearestX(this.positionHoles(), 'startX');
  },

  _nearestX: function(items, key) {
    var nearest = {};
    nearest[key] = 10000000;
    var myX = this.positionMe().x;
    for(i in items) {
      var item = items[i];
      //every, not just in front
      //if(nearest == null || (myX - nearest.x > myX -item.x)) {
      if(item[key] > myX && (nearest[key]) > (item[key])) {
        nearest = item;
      }
    }
    return nearest;
  },

  _getPosition: function(ele) {
    return {
      x: ele.x,
      y: ele.y,
      w: ele.w,
      h: ele.h
    };
  },

  // **********
  // * events *
  // **********

  onRestart: function(callback) {
    EnvironmentTracker.onRestart = callback;
  }
};
