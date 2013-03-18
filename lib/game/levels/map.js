ig.module( 'game.levels.map' )
.requires( 'impact.image','game.entities.player','game.entities.monster' )
.defines(function(){
LevelMap=/*JSON[*/{"entities":[{"type":"EntityPlayer","x":72,"y":142},{"type":"EntityMonster","x":135,"y":95}],"layer":[{"name":"new_layer_0","width":5,"height":4,"linkWithCollision":false,"visible":true,"tilesetName":"media/map-guide.png","repeat":false,"preRender":false,"distance":"1","tilesize":400,"foreground":false,"data":[[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20]]}]}/*]JSON*/;
LevelMapResources=[new ig.Image('media/map-guide.png')];
});