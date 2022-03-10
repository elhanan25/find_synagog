
let arrayOfSynagog = [];
let newArrayOfSynagog = [];
let dist;
let coords = [];
let minDist = 1000;
let myLat, myLng;
let map;
let destinationLat;
let destinationLng;
let myPosition;

class Synagog {
  constructor(name, location) {
    (this.name = name), (this.location = location);
  }
}

function initMap() {
  /* find my location */
  navigator.geolocation.getCurrentPosition(
    (position) => {
     myPosition = position;
      myLat = position.coords.latitude;
      myLng = position.coords.longitude;
      coords = [{ lat: myLat, lng: myLng }];
      goto();
    },
    (error) => {
      console.log(error.message);
    }
  );
/*  build map*/
  function goto() {
    const center = { lat: myLat, lng: myLng };

    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: center,
    });

    const marker = new google.maps.Marker({
      position: { lat: myLat, lng: myLng },
      map: map,
       });
  }


  $("#btn").on("click", getPlace);
  async function getPlace() {
    await fetch(`http://localhost:3000/getplace/${myLat}/${myLng}`)
      .then((res) => res.json())
      .then((data) => {
        arrayOfSynagog = data.results;
      });
    arrayOfSynagog.forEach((item) => {
      let objectOfSynagog = new Synagog(item.name, item.geometry.location);
      newArrayOfSynagog.push(objectOfSynagog);
    });
    
    findDistance(newArrayOfSynagog);
  }

  async function findDistance(newArrayOfSynagog) {
 
    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();

    // build request
    const origin1 = { lat: myLat, lng: myLng };
    let arrayOfSynagogLocations = [];
    newArrayOfSynagog.forEach((item) => {
      arrayOfSynagogLocations.push(item.location);
    });
   
    const request = {
      origins: [origin1],
      destinations: arrayOfSynagogLocations,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    await service
      .getDistanceMatrix(request)
      .then((response) => {       
        let drivetime, name;
        let routes = response.rows[0].elements;
        let short = 10000;
        for (let i = 0; i < routes.length; i++) {
          let min = routes[i].duration.value;
          if (min > 0 && min < short) {
            short = min;
            drivetime = routes[i].duration.text;
            name = response.destinationAddresses[i];
          }
        }
     
        let geocoder = new google.maps.Geocoder();
        var result = "";
        geocode({ address: name }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            result[lat] = results[0].geometry.location.Pa;
            result[lng] = results[0].geometry.location.Qa;
          } else {
            result = "Unable to find address: " + status;
          }
          storeResult(result);
        });

        function geocode(request) {
          geocoder.geocode(request).then((result) => {
            const { results } = result;
            let synagogLocation = results[0].geometry.location;
            map.setCenter(synagogLocation);
            var marker = new google.maps.Marker({
              map: map,
              position: synagogLocation,
            });
    
            destinationLat = synagogLocation.lat();
            destinationLng = synagogLocation.lng();

            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer();

            var center = new google.maps.LatLng(myLat, myLng);
            var mapOptions = {
              zoom: 7,
              center: center,
            };
           map = new google.maps.Map(
              document.getElementById("map"),
              mapOptions
            );
            directionsRenderer.setMap(map);
             calcRoute();
            function calcRoute() {           
              var request = {
                origin: `${myLat},${myLng}`,
                destination: name ,
                travelMode: "DRIVING",
              };
              directionsService.route(request, function (result, status) {
                if (status == "OK") {
                  directionsRenderer.setDirections(result);
                }
              });
            }
          });
        }
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  }
}
