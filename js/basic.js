






$(document).ready(function() {

  // Store variables
  var canvas = $("#gameCanvas");
  var context = canvas.get(0).getContext("2d");
  var x = canvas.width();
  var y = canvas.height();

  // Set defaults
  context.font = "18px san-serif";
  context.fillStyle = "rgb(255,255,255)";
  context.fillRect(0, 0, x, y);
  context.fillStyle = "rgb(0,0,0)";

  // Set latitude and longitude
  function showPosition(position) {
    latitude  =  position.coords.latitude;
    longitude =  position.coords.longitude;

    context.fillText("Latitude: "+latitude+". Longitude: "+longitude, 40, y/2);

    console.log(latitude);
    console.log(longitude);
  }

  // Detect for geolocation access
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }

  else {
    context.fillText("Pocket friends does not have geolocation access.", x/2, y/2);
  }

});
