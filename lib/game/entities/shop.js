ig.module(
	'game.entities.shop'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityShop = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/buildings.png', 80, 80),
		size: {x:65, y:50},
		offset: {x:8, y:29},

		init: function(x,y,settings) {
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
		},

		update: function() {
			this.parent();
		}
	});
});