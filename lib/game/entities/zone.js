ig.module(
	'game.entities.zone'
)
.requires(
	'impact.zone'
)
.defines(function(){
	EntityPlayer = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/background.png', 40, 40),
		size: {x:40, y:40},

		init: function(x,y,settings) {
			this.parent(x,y,settings);
			this.addAnim('water', 1, [0]);
		},

		update: function() {
			// Movement for testing
			var accel = this.standing ? this.accelGround : this.accelAir;
			if (ig.input.state('left')) {
				this.accel.x = -accel;
				this.flip = true;
			}

			else if (ig.input.state('right')) {
				this.accel.x = accel;
				this.flip = false;
			}

			else {
				this.accel.x = 0;
			}

			if (ig.input.state('up')) {
				this.accel.y = -accel;
			}

			else if (ig.input.state('down')) {
				this.accel.y = accel;
			}

			else {
				this.accel.y = 0;
			}

			this.parent();
		}
	});
});