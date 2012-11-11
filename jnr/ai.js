Nodes = [];
function createNode(){
  node = {
    distanceFromGoal: API.distanceToGoal(),
    xDistanceFromNearestBlock: API.nearestBlock().x - API.positionMe().x,
    yDistanceFromNearestBlock: API.nearestBlock().y - API.positionMe().y,
    distanceFromNearestGround: API.nearestHole().endX - API.positionMe().x ,
    won: API.win(),
    dead: API.death(),
    results: {}
  }
  Nodes.push(node);
  return node;
}
Running = false;
Params = {
  jumpDistance: 157,
  actions: [
    'jumpRight',
//  'jumpLeft',
  'walkRight'
//  'walkLeft'
    ]
}
function startAI(){
  start();
  //console.dir(Nodes);
  API.onRestart(function(won) {
    if(!Running) {
      stop(won);
    } else {
      stop(won);
      start();
    }
  });
}

function similiarNode(compareTo){
  tn = null;
  for(i=0;i < Nodes.length;i++ ) {
    if (Nodes[i] != compareTo){
      if(tn == null ||
          (Math.abs(Nodes[i].distanceFromNearestGround - compareTo.distanceFromNearestGround) < 
           Math.abs(tn.distanceFromNearestGround - compareTo.distanceFromNearestGround))
        ){
          tn = Nodes[i];
        }
    }
  }
  if(tn != null){
    console.dir(Math.abs(tn.distanceFromNearestGround - compareTo.distanceFromNearestGround));
  }
  return tn;
}

function getBestAction(node){
  console.dir(node.xDistanceFromNearestBlock);
  console.dir(node.distanceFromNearestGround);
  if(node.xDistanceFromNearestBlock < node.distanceFromNearestGround){
    if(node.xDistanceFromNearestBlock < Params.jumpDistance){
      return ["jumpRight", node.xDistanceFromNearestBlock + node.yDistanceFromNearestBlock + 150];
    }else{
      return ["walkRight", 5];
    }
  }else{
    if(node.distanceFromNearestGround < Params.jumpDistance){
      return ["jumpRight", node.distanceFromNearestGround];
    }else{
      return ["walkRight", 5];
    }
  }
}

function stop(won) {
  Running = false;
  //remember stuff
}

function start() {
  Running = true;
  doPlay();
}

function doPlay(){
  n = createNode();
  //console.dir(Nodes);
  if(Running){
    /*sn = similiarNode(n);*/
    /*act = null*/
    /*if (sn != null){*/
    act = getBestAction(n);
    /*}*/
    /*if(act == null){*/
    /*act = Params.actions[rand(0,1)];*/
    /*}*/

    API[act[0]](function(){
      n.results[act[0]] = createNode();
      doPlay();
    }, act[1]);
    /*if(act == 'walkRight' || act == 'walkLeft'){
      console.debug('walk');
      API[act](15, function(){
        n.results[act] = createNode();
        doPlay();
      });
    }else{
      console.debug('jump');
      API[act](function(){
        n.results[act] = createNode();
        doPlay();
      });
    }*/
  }
}
