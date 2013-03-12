$(document).ready(function() {


  // Setup
  var canvas = $("canvas"),
      context = canvas.get(0).getContext("2d"),
      canvasWidth = canvas.width(),
      canvasHeight = canvas.height(),
      backgroundImg = new Image(),
      playerImg = new Image();

  // Resources
  backgroundImg.src = "../img/background.png",
  playerImg.src = "../img/player.png";

  // Initialize game environment
  function init() {

    player();

  };

  init();

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

  // var playerLatitude;
  // var playerLongitude;
  // var playerImg = new Image();
  // playerImg.src = "../img/player.png";
  // var backgroundImg = new Image();
  // backgroundImg.src = "../img/background.png";


  // // Set defaults
  // context.font = "18px san-serif";
  // context.fillStyle = "rgb(255,255,255)";
  // context.fillRect(0, 0, x, y);
  // context.fillStyle = "rgb(0,0,0)";

  // // Initialize
  // $(backgroundImg).load(function() {  
  //   context.drawImage(backgroundImg, 0,0);
  // })
  //   $(playerImg).load(function() {
  //     context.drawImage(playerImg,x/2,y/2);
  // })

  // // Set latitude and longitude
  // function showPosition(position) {
  //   playerLatitude  =  position.coords.latitude;
  //   playerLongitude =  position.coords.longitude;

  //   context.fillText("Latitude: "+playerLatitude+". Longitude: "+playerLongitude, 40, 20);

  //   console.log(playerLatitude);
  //   console.log(playerLongitude);
  // }

  // // Detect for geolocation access
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(showPosition);

  //   // Translate origin of context
  //   // context.translate(150,150);
  //   imgObj = new Image();
  // }

  // else {
  //   context.fillText("Pocket friends does not have geolocation access.", x/2, y/2);
  // }

});
