Nodes = [];
function createNode(){
  node = {
    distanceFromGoal: API.distanceToGoal(),
    //  distanceFromNearestBlock: API.nearestBlock().x - API.positionMe().x,
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

/*function getBestAction(node){*/
/*//console.dir("Action");*/
/*ta = null;*/
/*Object.keys(node.results).forEach(function(a) {*/
/*successorState = node.results[a];*/
/*if(( successorState.dead == false &&*/
/*successorState.distanceFromGoal < node.distanceFromGoal) && */
/*(ta == null || successorState.distanceFromGoal < node.results[ta].distanceFromGoal)){*/
/*//console.dir(ta);*/
/*ta = a;*/
/*}*/
/*});*/
/*//console.dir(ta);*/
/*return ta;*/
/*}*/

function getBestAction(node){
  if(node.distanceFromNearestGround > 0 &&
     node.distanceFromNearestGround < Params.jumpDistance
    ){
    return "jumpRight";
  }else{
    console.dir(node.distanceFromNearestGround);
    return "walkRight";
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

    API[act](function(){
      n.results[act] = createNode();
      doPlay();
    }, 5);
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
