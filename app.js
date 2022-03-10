const express = require("express");
const axios = require('axios');
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname , 'public')))
// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "./public/index.html");
// });
app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});

app.get('/getplace/:lat/:lng', (req, res)=>{
  let {lat} = req.params;
  let {lng} = req.params;

    var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=5000&type=synagogue&&keyword=cruise&language=wi&key=AIzaSyCVlyDNGFlJqdcpRzBDWZGzlEUOIhP68JA`,
        headers: { }
      };
      let array = [];
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data))
        res.send(JSON.stringify(response.data));
        // array = JSON.stringify(response.data);
        // console.log(array.results.forEach((item)=>{return item.name}));
      })
      .catch(function (error) {
        console.log(error);
      });
})

// app.get('/mylatlng/', (req,res)=>{
//   let { id } = req.params;
//   var config = {
//     method: 'get',
//     url: ` https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyCVlyDNGFlJqdcpRzBDWZGzlEUOIhP68JA`,
//     headers: { }
//   };

//   axios(config)
//   .then(function (response) {
//     console.log(JSON.stringify(response));
//     res.send(JSON.stringify(response.data))
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// })




