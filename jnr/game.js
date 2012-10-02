function writeInfo(msg) {
  EnvironmentTracker.logging_windows.info.text(msg);
}

EnvironmentTracker = {};
function restart() {
  Crafty('player').destroy();
  Crafty('ground').destroy();
  Crafty('block').destroy();
  
  createBlocksAndGrounds();
  initPlayer();

  Crafty.viewport.y = -100;
  Crafty.viewport.x = 50;
  moveLoggingWindow(0);
}

function initMovement() {
  Crafty.c("Twoway", {
    _speed: 3,
    _up: false,
    
    endPosition: null,
    endPosCallback: null,
    jumpCallback: null,

    dead: false,
    die: function() {
      writeInfo("hit");
      //Crafty('player').destroy();
      this.dead = true;
      this._stopMoving();
      this.stop();
      restart();
    },
    
    _stopMoving: function() {
      this.disableControl();
      this.reset();
      this.addComponent('standing_right');
    },
    
    won: false,
    win: function() {
      writeInfo("tadaaaa!");
      this.won = true;
      this._stopMoving();
      restart();
    },
    
    isStopped: function() {
      return this.disableControls || this.won || this.dead;
    },
    init: function () {
      this.requires("Fourway, Keyboard");
    },
 
    twoway: function (speed, jump) {
      this.multiway(speed, {
        RIGHT_ARROW: 0,
        LEFT_ARROW: 180,
        D: 0,
        A: 180
      });

      if (speed) this._speed = speed;
      jump = jump || this._speed * 2;

      this.bind("EnterFrame", function () {
        if (this.isStopped()) return;
        if (this._up) {
          this.y -= jump;
          this._falling = true;
          this.trigger('Moved', { x: this.x, y: this.y + jump });
        }
      }).bind("KeyDown", function () {
        if (this.isDown("UP_ARROW") || this.isDown("W") || this.isDown("SPACE"))
          this._up = true;
      });

      return this;
    }
  });
}

function initPlayer() {
  initMovement();
  
  EnvironmentTracker.player = Crafty.e("2D, DOM, Twoway, Gravity, Collision, player, SpriteAnimation")
      .twoway(3, 11)
      .animate("walk_right", 0, 2, 2)
      .animate("walk_left", 0, 3, 2)
      .gravity("Floor")
      .attr({w: 45, h: 45, x: 100, y: 350})
      .gravityConst(0.5)        
      .bind('Moved', function(from) {
        if(!this.isStopped()) {
          // move camera if in range
          if(this.x >= 150 && this.x <= 2500) {
            Crafty.viewport.x = 200 - this.x;
            moveLoggingWindow(this.x - 150);
          }
          
          if(from.x > this.x){
            if(!this.isPlaying("walk_left"))
              this.animate("walk_left", 3, -1);
            this.left = true;
          }else if(from.x < this.x){
            if(!this.isPlaying("walk_right"))
              this.animate("walk_right", 3, -1);
            this.left = false;
          }

          if(this.hit('solid')) {
            this.attr({x: from.x, y:from.y});
            this._up = false;
          }

          if(this.endPosition != null && Math.abs(this.x - this.endPosition) < 5) {
            this.endPosCallback();
            this.endPosition = null;
            this.endPosCallback = null;
          }
        }
      })
      .onHit('deadly', function() {
        if(!this.dead) this.die();
      })
      .onHit('finish', function() {
        if(!this.won) this.win();
      })
      .bind('KeyDown', function(e) {
        if (!this.isStopped() && e.key == Crafty.keys.UP_ARROW) {
          if(this.left){
            this.addComponent("jumping_left");
          }else{
            this.addComponent("jumping_right");
          }
        }
      })
      .bind('KeyUp', function(e) {
          this.stop();
          if(this.left){
            this.addComponent("standing_left");
          }else{
            this.addComponent("standing_right");
          }
      })
      .bind('hit', function() {
        if(this.jumpCallback != null) {
          this.jumpCallback();
          this.jumpCallback = null;
        }
      });
}
    
function createBlocksAndGrounds() {
  Crafty.c("Floor", {});
  
  var used = 0;
  var max = 2000;
  
  while(used < max) {
    var ground_width = rand(3, 12) * 50;
    createGround(ground_width, used);
    used += ground_width + rand(1, 3) * 50;
  }
  createGround(3000 - used, used);
  
  var usedX = [];
        
  EnvironmentTracker.blocks = [];
  for(var i = 0; i < 15; i++){
    var currentX;
    do {
      currentX = rand(0,43)*50+200;
    } while(usedX.indexOf(currentX) != -1);
    usedX.push(currentX);
    
    createBlock(currentX + 10, 360 - rand(0,1)*50);
    if(rand(0,3) == 0) {
      nextX = currentX + 50;
      if(usedX.indexOf(nextX) == -1) {
        usedX.push(nextX);
        createBlock(nextX + 10, 360 - rand(1,2)*50);
      }
    }
  }
}

function rand(start, end) {
  return Crafty.math.randomInt(start, end);
}

function createBlock(x, y) {
  var block = Crafty.e("Floor, solid, 2D, DOM, Color, block")
                    .color("brown")
                    .attr({w: 30, h: 30, x: x, y: y});
  EnvironmentTracker.blocks.push(block);
  return block;
}

function createGround(width, xAxis) {
  Crafty.e("Floor, solid, 2D, DOM, Gravity, Color, ground")
        .color("green")
        .attr({w: width, h: 300, x: xAxis, y: 400});
}

function initLoggingWindow() {
  Crafty.c("LogText", {
    init: function() {
      this.requires("2D, DOM, Text");
      this.attr({w: 300, h: 15});
      this.css({"font": "10pt Arial"});
      return this;
    }
  });

  w = EnvironmentTracker.logging_windows = {};
  w.posx = Crafty.e("LogText").attr({y: 100});
  w.posy = Crafty.e("LogText").attr({y: 115});
  w.block_number = Crafty.e("LogText").attr({y: 130});
  w.info = Crafty.e("LogText").attr({y: 155});
  logSensorValues();
}

function moveLoggingWindow(x){
  Object.keys(EnvironmentTracker.logging_windows).forEach(function(key) {
     EnvironmentTracker.logging_windows[key].x = x;
  });
}

function logSensorValues(){
  EnvironmentTracker.logging_windows.posx.text(
   "PosX: " + EnvironmentTracker.player.pos()._x
  );
  EnvironmentTracker.logging_windows.posy.text(
   "PosY: " + EnvironmentTracker.player.pos()._y
  );
  EnvironmentTracker.logging_windows.block_number.text(
   "Blocks: " + EnvironmentTracker.blocks.length
  );
  setTimeout(logSensorValues, 0.5);
}

function createGame() {
  Crafty.init(3000, 400);
  
  Crafty.viewport.init(600, 400);
  Crafty.viewport.y = -100;
  Crafty.viewport.x = 50;

  Crafty.background('rgb(127,127,127)');
  Crafty.sprite(45, "player.png", {
    standing_right: [0, 0],
    running_right: [1, 0],
    jumping_right: [2, 0],
    standing_left: [0, 1],
    running_left: [1, 1],
    jumping_left: [2, 1],
    player: [0,2]
  });
  
  Crafty.e("deadly, 2D").attr({w: 3400, h: 100, x: -200, y: 600});
  Crafty.e("finish, 2D, Color, DOM").color("blue").attr({w: 10, h: 300, x: 2500, y: 100});
     
  createBlocksAndGrounds();
  
  initPlayer();
  initLoggingWindow();
}
