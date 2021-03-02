var express = require("express");
var router = express.Router();

var scores = require('../scores.json');

router.get("/score/:score/:name", function(req, res, next){

  let score={
    "score": req.params['score'],
    "player": req.params['name'],
    "date": new Date().toLocaleString()
  };
  //obj = JSON.parse(score);
  scores.push(score);
  JSON.stringify(scores);

  var fs = require('fs');

//   fs.readFile('./scores.json', 'utf8', function readFileCallback(err, data){
//     if (err){
//         console.log(err);
//     } else {
//     obj = JSON.parse(data); //now it an object
//     obj.table.push(score); //add some data
//     json = JSON.stringify(obj); //convert it back to json
//     fs.writeFile('./scores.json', json, 'utf8', callback); // write it back
// }});


  fs.writeFile ("./scores.json", scores, function(err) {
    if (err) throw err;
    console.log('complete');
    }
  );



  console.log(score.date);

  res.send(score);

});

module.exports = router;
