ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.map',
	'game.entities.player',
	'plugins.value-map',
	'plugins.impact-storage',
	'plugins.analog-stick'
)
.defines(function() {

MyGame = ig.Game.extend({
	
	worldPositionStart: [42.358041,-71.074194],
    worldPositionEnd: 	[42.351577,-71.062324],
    geolocationOn: false,
    inRange: false,
    battleMode: false,
    monsterExists: false,
    randomBattleTimer: new ig.Timer(0),
    playerData: new ig.Storage(),

	setUIvariables: function () {
		var errorUI 		= document.getElementById('errorUI'),
      		gameUI 			= document.getElementById('gameUI'),
      		debugMessage 	= document.getElementById('debugMessage'),
      		debugMessage2	= document.getElementById('debugMessage2'),
      		battleUI		= document.getElementById('battleUI'),
       		enemyGraphics 	= document.getElementById('battle-enemyGraphics'),
      		playerGraphics 	= document.getElementById('battle-playerGraphics');

      	this.runButton		= document.getElementById('runButton'),
      	this.fightButton 	= document.getElementById('fightButton'),
      	this.playerName		= document.getElementById('player-name'),
      	this.playerLevel 	= document.getElementById('player-level'),
      	this.playerHP 		= document.getElementById('player-hp'),
      	this.enemyName		= document.getElementById('enemy-name'),
      	this.enemyLevel 	= document.getElementById('enemy-level'),
      	this.enemyHP 		= document.getElementById('enemy-hp');
      	
      	this.playerData.initUnset('name', 'Puppy');
		this.playerData.initUnset('level', '1');
		this.playerData.initUnset('name', '0');
		this.playerData.initUnset('currentHP', '5');
		this.playerData.initUnset('totalHP', '5');
		this.playerData.initUnset('attack', '1');
	},

	errorScreen: function(message) {
		errorUI.innerHTML = message;
		errorUI.style.display = "block";
		gameUI.style.display = "block";
		gameUI.style.backgroundColor = "#000000";
	},

	battleScreen: function() {
		battleUI.style.display = "block";
		gameUI.style.display = "block";
		gameUI.style.backgroundColor = "#000000";

		this.playerName.innerHTML = this.playerData.get('name');
		this.playerLevel.innerHTML = this.playerData.get('level');
		this.playerHP.style.width = this.playerData.get('currentHP')/this.playerData.get('totalHP')*100+"%";

		this.enemyName.innerHTML = this.monsterName;
		this.enemyLevel.innerHTML = this.monsterLevel;
		this.enemyHP.style.width = this.monsterCurrentHP/this.monsterHP*100+"%";
	},

	createMonster: function() {
		this.monsterExists = true;
		this.monsterName = "Flower";
		this.monsterLevel = 1;
		this.monsterAttack = 1;
		this.monsterHP = 3;
		this.monsterCurrentHP = 3;
		this.monsterEXP = 5;
	},

	removeAllScreens: function() {
		errorUI.style.display = "none";
		gameUI.style.display = "none";
		battleUI.style.display = "none";
	},

	setGeolocation: function (position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		// speed = position.coords.speed;

		ig.game.geolocationOn = true;

		if ((latitude<=ig.game.worldPositionStart[0])&&(latitude>=ig.game.worldPositionEnd[0])&&(longitude<= ig.game.worldPositionEnd[1])&&(longitude>= ig.game.worldPositionStart[1])) {
			ig.game.inRange = true;
		}

		debugMessage.innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;
	},

	geolocationError: function(errorObject) {
		this.errorScreen("Geolocation is not working!");
	},

	setPlayerLocation: function (player) {
		playerPosition = this.translatePosition(latitude,longitude);
		player.pos.x = playerPosition[0]- player.size.x/2;
		player.pos.y = playerPosition[1]- player.size.y/2;
	},

	translatePosition: function(latitude,longitude) {
    	mapX = (longitude - this.worldPositionStart[1])/(this.worldPositionEnd[1]-this.worldPositionStart[1])*1100;
    	mapY = (latitude - this.worldPositionStart[0])/(this.worldPositionEnd[0]-this.worldPositionStart[0])*800;
    	return [mapX,mapY];
    },

	init: function() {
		// Bind keys for testing
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');

		// var baseSize = 60;
	 //    var stickSize = 30;
	 //    var margin = 20;
	 //    var y = ig.system.height - baseSize - margin;
	 //    var x1 = baseSize + margin;
	 //    var x2 = ig.system.width - baseSize - margin;

	 //    this.stickLeft = new ig.AnalogStick( x1, y, baseSize, stickSize );
	 //    this.stickRight = new ig.AnalogStick( x2, y, baseSize, stickSize );               
		// Create the ability to hide map layers
		ig.BackgroundMap.inject({visible:true, draw:function () { "use strict"; if (!this.visible) return; this.parent(); }});

		latitude = 42.358041;
		longitude = -71.074194;

		this.randomBattleTimer.reset();

		this.setUIvariables();
		this.loadLevel(LevelMap);
	},

	loadLevel: function(level) {
		this.parent(ig.copy(level));

		// Setup zones
		var zoneMap = ig.game.getMapByName('map');
    	this.zoneMap = new ig.ValueMap(zoneMap.tilesize, zoneMap.data, false);
	},

	update: function() {
		var player = this.getEntitiesByType( EntityPlayer )[0],
			playerPosX = player.pos.x,
			playerPosY = player.pos.y,
			playerHalfWidth = player.size.x/2,
			playerHalfHeight = player.size.y/2;
		
		// Change player position
		navigator.geolocation.getCurrentPosition(this.setGeolocation, this.geolocationError, {enableHighAccuracy:true, maximumAge: 0});
		// this.setPlayerLocation(player);
		
		var zoneValue = this.zoneMap.getValue(playerPosX+playerHalfWidth, playerPosY+playerHalfHeight*2);

		if ((player.vel.x>.8 || player.vel.y>.8) && !this.battleMode) {
			debugMessage2.innerHTML = "Velocity x = "+player.vel.x+"<br> Velocity y = "+player.vel.y;
			this.randomBattleTimer.reset();
	
			if (Math.random()<=.01 && zoneValue == 4) {
				this.battleMode = true;
			}
		}

		else if (this.randomBattleTimer.delta()>1.5) {
				this.moving = false;
		}

		this.parent();		


		// Set camera
		this.screen.x = playerPosX - ig.system.width/2 + playerHalfWidth;
		this.screen.y = playerPosY - ig.system.height/2 + playerHalfHeight;
	},

	draw: function() {
		this.parent();

		// this.stickLeft.draw();

		if (this.battleMode) {

			if (!this.monsterExists) {
				this.createMonster();
			}

			this.battleScreen();


			this.runButton.onclick = function() {
				ig.game.battleMode = false;
				ig.game.removeAllScreens();
			}

			this.fightButton.onclick = function() {
				ig.game.monsterCurrentHP -= 1;
				if (ig.game.monsterCurrentHP==0) {
					this.monsterExists = false;
					ig.game.battleMode = false;
					ig.game.removeAllScreens();
				}
			}

		}

	// 	if (!this.geolocationOn) {
	// 		this.errorScreen("Searching for location...");
	// 	}

	// 	else if (!this.inRange) {
	// 		this.errorScreen("Out of range! Pocket Friends only works in the Boston Commons.");
	// 	}

	// 	else {
	// 		this.removeAllScreens();
	// 	}
	}

});

ig.main('#canvas', MyGame, 60, 160, 210, 2);

});