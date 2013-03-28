ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.map',
	'game.entities.player',
	'plugins.value-map',
	'plugins.impact-storage'
)
.defines(function() {

MyGame = ig.Game.extend({
	
    testGeolocation: true,
    autoSort: true,
    sortBy: ig.Game.SORT.POS_Y,

	setUIvariables: function () {
		var errorUI 		= document.getElementById('errorUI'),
      		gameUI 			= document.getElementById('gameUI'),
      		debugMessage 	= document.getElementById('debugMessage'),
      		debugMessage2	= document.getElementById('debugMessage2'),
      		battleUI		= document.getElementById('battleUI'),
       		enemyGraphics 	= document.getElementById('battle-enemyGraphics'),
      		playerGraphics 	= document.getElementById('battle-playerGraphics');

      	this.titleScreenUI	= document.getElementById('titleScreenUI'),
      	this.introScreenUI	= document.getElementById('introScreenUI'),
      	this.runButton		= document.getElementById('runButton'),
      	this.fightButton 	= document.getElementById('fightButton'),
      	this.playerName		= document.getElementById('player-name'),
      	this.playerLevel 	= document.getElementById('player-level'),
      	this.playerHP 		= document.getElementById('player-hp'),
      	this.enemyName		= document.getElementById('enemy-name'),
      	this.enemyLevel 	= document.getElementById('enemy-level'),
      	this.enemyHP 		= document.getElementById('enemy-hp'),
      	this.boxMessage		= document.getElementById('battle-boxMessage'),

		this.battleTest		= document.getElementById('battleTest'),
      	this.geolocationOnButton	= document.getElementById('geolocationOn');

      	this.worldPositionStart	= [42.358041,-71.074194],
    	this.worldPositionEnd	= [42.351577,-71.062324],
    	this.inRange			= false,
    	this.battleMode			= false,
    	this.monsterExists		= false,
    	this.randomBattleTimer  = new ig.Timer(0),
    	this.playerData			= new ig.Storage(),
    	this.testGeolocation	= true,
    	this.geolocationOn		= false,
   		this.healed 			= false;
      	
      	this.playerData.initUnset('name', 'Puppy');
		this.playerData.initUnset('level', 1);
		this.playerData.initUnset('currentHP', 5);
		this.playerData.initUnset('totalHP', 5);
		this.playerData.initUnset('attack', 2);
		this.playerData.initUnset('experience', 0);
		this.playerData.initUnset('neededExp', 20);
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

		level = Math.floor(Math.random()*4)+1;
		this.monsterLevel = level;
		this.monsterAttack = Math.floor(level*2/3+1);
		this.monsterHP = Math.floor(level*2/3+3);
		this.monsterCurrentHP = this.monsterHP;
		this.monsterEXP = level*5;

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
	},

	geolocationError: function(errorObject) {
		ig.game.errorScreen.innerHTML = 'Geolocation is not working!';
	},

	setPlayerLocation: function () {
		playerPosition = this.translatePosition(latitude,longitude);
		this.player.pos.x = playerPosition[0]- this.player.size.x/2;
		this.player.pos.y = playerPosition[1]- this.player.size.y/2;
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
		ig.input.bind( ig.KEY.MOUSE1, "CanvasTouch" );
           
		// Create the ability to hide map layers
		ig.BackgroundMap.inject({visible:true, draw:function () { "use strict"; if (!this.visible) return; this.parent(); }});

		this.setUIvariables();

		this.randomBattleTimer.reset();
		this.loadLevel(LevelMap);
	},

	loadLevel: function(level) {
		this.parent(ig.copy(level));

		// Setup zones
		var zoneMap = ig.game.getMapByName('map');
    	this.zoneMap = new ig.ValueMap(zoneMap.tilesize, zoneMap.data, false);
	},

	update: function() {

		this.player = this.getEntitiesByType( EntityPlayer )[0]

		var	playerPosX = this.player.pos.x,
			playerPosY = this.player.pos.y,
			playerHalfWidth = this.player.size.x/2,
			playerHalfHeight = this.player.size.y/2;
		
		// Change player position
		navigator.geolocation.getCurrentPosition(this.setGeolocation, this.geolocationError, {enableHighAccuracy:true, maximumAge: 0});
		
		
		var zoneValue = this.zoneMap.getValue(playerPosX+playerHalfWidth, playerPosY+playerHalfHeight*2);

		if ((this.player.vel.x>.8 || this.player.vel.y>.8) && !this.battleMode) {
			this.randomBattleTimer.reset();
	
			if (Math.random()<=.05 && zoneValue == 4) {
				this.battleMode = true;
			}
		}

		else if (this.randomBattleTimer.delta()>1.5) {
				this.moving = false;
		}

		// geolocation test
		this.geolocationOnButton.onclick = function() {
			ig.game.testGeolocation = false;
			ig.game.removeAllScreens();
		}

		this.battleTest.onclick = function() {
			ig.game.battleMode = true;
		}

		this.parent();		


		// Set camera
		this.screen.x = playerPosX - ig.system.width/2 + playerHalfWidth;
		this.screen.y = playerPosY - ig.system.height/2 + playerHalfHeight;
	},

	draw: function() {
		this.parent();

		this.titleScreenUI.onclick = function() {
			ig.game.titleScreenUI.style.display = "none"
		}

		this.introScreenUI.onclick = function() {
			ig.game.introScreenUI.style.display = "none"
		}

		if (this.testGeolocation==true) {
			if (!this.geolocationOn) {
				this.errorScreen("Searching for location...");
			}

			else if (!this.inRange) {
				this.errorScreen("Out of range! Pocket Friends only works in the Boston Commons.");
			}

			else {
				this.removeAllScreens();
			}
		}

		else if (this.battleMode) {

			if (!this.monsterExists) {
				this.createMonster();
			}

			if (!this.healed) {
				totalHP = this.playerData.get('totalHP');
				this.playerData.set('currentHP', totalHP);
				this.healed = true;
			}

			this.battleScreen();


			this.runButton.onclick = function() {

				ig.game.boxMessage.style.display = "block";
				ig.game.boxMessage.innerHTML = "You ran away.";

				ig.game.boxMessage.onclick = function () {
					ig.game.battleMode = false;
					ig.game.monsterExists = false;
					ig.game.boxMessage.style.display = "none";
					ig.game.healed = false;
					ig.game.removeAllScreens();
				}
			}

			this.fightButton.onclick = function() {


				ig.game.monsterCurrentHP -= ig.game.playerData.get('attack');

				if (ig.game.monsterCurrentHP<0) {
					ig.game.monsterCurrentHP=0;
				}

				ig.game.boxMessage.style.display = "block";
				ig.game.boxMessage.innerHTML = "You hit "+ig.game.monsterName+"!";

				ig.game.boxMessage.onclick = function () {

					newHP = ig.game.playerData.get('currentHP') - ig.game.monsterAttack;

					if (newHP < 0) {
							newHP = 0;
					}
					
					ig.game.playerData.set('currentHP', newHP);

					if (newHP <= 0) {
						ig.game.boxMessage.innerHTML = "Flower hits you! Puppy fainted.";

						ig.game.boxMessage.onclick = function () {
							ig.game.monsterExists = false;
							ig.game.battleMode = false;
							ig.game.boxMessage.style.display = "none";
							ig.game.healed = false;
							ig.game.removeAllScreens();
						}
					}
					else {
						ig.game.boxMessage.innerHTML = "Flower hits you!";
						ig.game.boxMessage.onclick = function () {
							ig.game.boxMessage.style.display = "none";
						}
					}
				}

				if (ig.game.monsterCurrentHP <= 0) {
					ig.game.boxMessage.style.display = "block";
					ig.game.boxMessage.innerHTML = "You hit "+ig.game.monsterName+"! "+ig.game.monsterName+" was defeated.";


					newEXP = ig.game.playerData.get('experience') + ig.game.monsterEXP;
					newNeededEXP = ig.game.playerData.get('neededExp') - ig.game.monsterEXP;

					ig.game.playerData.set('experience', newEXP);
					ig.game.playerData.set('neededExp', newNeededEXP);

					ig.game.boxMessage.onclick = function () {

						if (newNeededEXP <= 0) {
							newLevel 		= ig.game.playerData.get('level') + 1;
							newTotalHP	 	= ig.game.playerData.get('totalHP') + 1;
							newAttack		= ig.game.playerData.get('attack') +1;
							ig.game.playerData.set('level', newLevel);
							ig.game.playerData.set('totalHP', newTotalHP);
							ig.game.playerData.set('attack', newAttack);
							newNeededEXP 	= ig.game.playerData.get('level')*ig.game.playerData.get('level')*10+20
							ig.game.playerData.set('neededExp', newNeededEXP);
							ig.game.boxMessage.innerHTML = ig.game.playerData.get('name') + " leveled up!";
						}

						else {

							ig.game.boxMessage.innerHTML = ig.game.playerData.get('name') + " gained " +  ig.game.monsterEXP + " exp points. Needs " + ig.game.playerData.get('neededExp') + " more to level up.";

							ig.game.boxMessage.onclick = function () {
								ig.game.monsterExists = false;
								ig.game.battleMode = false;
								ig.game.boxMessage.style.display = "none";
								ig.game.healed = false;
								ig.game.removeAllScreens();
							}
						}
					}
				}
			}

		}

		else {
			this.removeAllScreens();
		}
	}
});

ig.main('#canvas', MyGame, 60, 160, 210, 2);

});