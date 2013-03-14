ig.module(
	'game.entities.monster'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityMonster = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/monster-flower.png', 40, 40),
		size: {x:22, y:29},
		offset: {x:11, y:11},
		flip: false,
		maxVel: {x:100, y:100},


		friction: {x:600, y:600},
		accelGround: 400,
		accelAir: 400,

		init: function(x,y,settings) {
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
		},

		update: function() {
			this.parent();
		}
	});
});