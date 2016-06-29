var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var game = require('../game/logic');

router.post('/fight/:user1/:user1_fighter/:user2/:user2_fighter', function(req, res){
  var userId1 = req.params.user1;
  var userId2 = req.params.user2;
  var userFighter1 = req.params.user1_fighter;
  var userFighter2 = req.params.user2_fighter;

  var outcome = game.fight(userId1,userFighter1,userId2,userFighter2);

  res.render('fight/win', {outcome:outcome});
})

router.put('/fight/:user1/:user1_fighter/:user2/:user2_fighter', function(req, res){

})

router.put('/win', function(req, res){

})




module.exports = router;
