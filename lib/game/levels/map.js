ig.module( 'game.levels.map' )
.requires( 'impact.image','game.entities.player','game.entities.monster' )
.defines(function(){
LevelMap=/*JSON[*/{"entities":[{"type":"EntityPlayer","x":72,"y":142},{"type":"EntityMonster","x":135,"y":95}],"layer":[{"name":"new_layer_0","width":11,"height":8,"linkWithCollision":false,"visible":1,"tilesetName":"media/map-guide3.png","repeat":false,"preRender":true,"distance":"1","tilesize":100,"foreground":false,"data":[[1,2,3,4,5,6,7,8,9,10,11],[12,13,14,15,16,17,18,19,20,21,22],[23,24,25,26,27,28,29,30,31,32,33],[34,35,36,37,38,39,40,41,42,43,44],[45,46,47,48,49,50,51,52,53,54,55],[56,57,58,59,60,61,62,63,64,65,66],[67,68,69,70,71,72,73,74,75,76,77],[78,79,80,81,82,83,84,85,86,87,88]]}]}/*]JSON*/;
LevelMapResources=[new ig.Image('media/map-guide3.png')];
});