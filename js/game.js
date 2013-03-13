$(document).ready(function() {


  // Set up variables
  var canvas = $("canvas"),
      context = canvas.get(0).getContext("2d"),
      canvasWidth = canvas.width(),
      canvasHeight = canvas.height();

  // Load resources
  var backgroundImg = new Image();
  backgroundImg.src = "img/background.png";
  var playerImg = new Image();
  playerImg.src = "img/player.png";

  // Functions

  function init() {
    background();
    player();
    navigator.geolocation.getCurrentPosition(returnLocation);
  };

  function player() {
    $(playerImg).load(function() {
      playerX = canvasWidth/2-playerImg.naturalWidth/2;
      playerY = canvasHeight/2-playerImg.naturalHeight/2;
      context.drawImage(playerImg,playerX,playerY);
    })
  }

  function background() {
    $(backgroundImg).load(function() {
      context.drawImage(backgroundImg,0,0);
    })
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
   context.fillText("Latitude: "+latitude+". Longitude: "+longitude, 20, 20);
  }

  // Draw

  // Initialize game
  init();

});
