var express = require("express");
var router = express.Router();

const questions = require('../questions.json');

router.get("/:id", function(req, res, next){

  let id= req.params['id'];

  res.send(questions[id]);

  //console.log();

});

module.exports = router;
