var express = require("express");
var router = express.Router();

const questions = require('../questions.json');

router.get("/", function(req, res, next){
  res.send(questions);

});

//return the total number of questions
router.get("/all", function(req, res, next){
  res.json(questions.length);

  console.log(questions.length);

});

module.exports = router;
