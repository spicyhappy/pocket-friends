$(document).ready(function() {


  // Set up variables
  var canvas = $("canvas"),
      context = canvas.get(0).getContext("2d"),
      canvasWidth = canvas.width(),
      canvasHeight = canvas.height(),
      geolocationRange1 = [42.39177,-71.16085],
      geolocationRange2 = [42.30626, -71.02180],
      debugLog = $("#debugLog");

  // Load resources

  // Functions

  function init() {
    background();
    player();
    navigator.geolocation.getCurrentPosition(returnLocation);
  }

// Asset Manager from http://www.html5rocks.com/en/tutorials/games/assetmanager/
  
    function AssetManager() {
      this.successCount = 0;
      this.errorCount = 0;
      this.cache = {};
      this.downloadQueue = [];
    }

    AssetManager.prototype.queueDownload = function(path) {
      this.downloadQueue.push(path);
    }

    AssetManager.prototype.downloadAll = function(downloadCallback) {
      if (this.downloadQueue.length === 0) {
        downloadCallback();
      }
      for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        var img = new Image();
        var that = this;

      img.addEventListener("load", function() {
          console.log(this.src + ' is loaded');
          that.successCount += 1;
          if (that.isDone()) {
              downloadCallback();
          }
      }, false);

      img.addEventListener("error", function() {
          that.errorCount += 1;
          if (that.isDone()) {
              downloadCallback();
          }
      }, false);

        img.src = path;
        this.cache[path] = img;
      }
    }

    AssetManager.prototype.isDone = function() {
        return (this.downloadQueue.length == this.successCount + this.errorCount);
    }

    AssetManager.prototype.getAsset = function(path) {
      return this.cache[path];
    }

  function player() {
    var playerImg = ASSET_MANAGER.getAsset("img/player.png");
    playerX = canvasWidth/2-playerImg.naturalWidth/2;
    playerY = canvasHeight/2-playerImg.naturalHeight/2;
    context.drawImage(playerImg,playerX,playerY);
  }

  function geolocationTranslator(playerGeoX,playerGeoY) {

    geoWidth = geolocation1[1]-geolocation2[1];
    geoHeight = geolocation1[0]-geolocation2[0];

  }

  function background() {
    var backgroundImg = ASSET_MANAGER.getAsset("img/background.png");
    context.drawImage(backgroundImg,0,0);
  }

  function detectGeolocation() {
    if ("geolocation" in navigator) {
      return true;
    }
    else {
      return false;
      alert("No geolocation, sorry");
    }
  }

  function returnLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    debugLog.append("<br>Latitude: "+latitude+"<br>Longitude: "+longitude); 
  }

  // Draw
  var ASSET_MANAGER = new AssetManager();
  ASSET_MANAGER.queueDownload('img/background.png');
  ASSET_MANAGER.queueDownload('img/player.png');

  ASSET_MANAGER.downloadAll(function() {
    init();
  });

});
