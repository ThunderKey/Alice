Nodes = [];
function createNode(){
  node = {
    distanceFromGoal: API.distanceToGoal(),
    //  distanceFromNearestBlock: API.nearestBlock().x - API.positionMe().x,
    distanceFromNearestGround: API.nearestHole().endX - API.positionMe().x,
    won: API.win(),
    results: {}
  }
  Nodes.push(node);
  return node;
}
Params = {
  jumpDistance: 132,
  actions: [
    'jumpRight',
  'jumpLeft',
  'walkRight',
  'walkLeft'
    ]
}
function startAI(){
  doPlay();
  console.dir(Nodes);

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
  return tn;
}

function getBestAction(node){
  console.dir("Action");
  ta = null
    Object.keys(node.results).forEach(function(a) {
      successorState = node.results[a];
      if(successorState.distanceFromGoal < node.results[ta].distanceFromGoal){
  console.dir(ta);
        ta = a;
      }
    });
  console.dir(ta);
  return ta;
}


function doPlay(){
  n = createNode();
  console.dir(Nodes);
  if(!n.won){
    sn = similiarNode(n);
    act = null
    if (sn != null){
      act = getBestAction(sn);
    }
    if(act == null){
      act = Params.actions[rand(0,3)];
    }
    if(act == 'walkRight' || act == 'walkLeft'){
      API[act](15, function(){
        n.results[act] = createNode();
        doPlay();
      });
    }else{
      API[act]( function(){
        n.results[act] = createNode();
        doPlay();
      });
    }
  }
}
