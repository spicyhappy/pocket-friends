ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityPlayer = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/player.png', 40, 40),
		size: {x:15, y:38},
		offset: {x:12, y:2},
		flip: false,

		// Movement (Testing)
		maxVel: {x:100, y:100},
		friction: {x:600, y:600},
		accelGround: 400,
		accelAir: 400,
		speed: 160,

		init: function(x,y,settings) {
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
			this.pos.x = -this.size.x/2;
			this.pos.y = -this.size.y/2;
		},

		update: function() {
			// Movement for testing

			this.vel.x = ig.game.stickLeft.input.x * this.speed;
			this.vel.y = ig.game.stickLeft.input.y * this.speed;

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