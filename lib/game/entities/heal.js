ig.module(
	'game.entities.heal'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityHeal = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/buildings.png', 80, 80),
		size: {x:61, y:62},
		offset: {x:13, y:18},

		init: function(x,y,settings) {
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [1]);
		},

		update: function() {
			this.parent();
		}
	});
});