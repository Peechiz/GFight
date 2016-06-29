var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var game = require('../game/logic');

router.post('/', function(req, res){
  
})

router.get('/:user1/:user1_fighter/:user2/:user2_fighter', function(req, res){
  var userId1 = req.params.user1;
  var userId2 = req.params.user2;
  var userFighter1 = req.params.user1_fighter;
  var userFighter2 = req.params.user2_fighter;

  var outcome = game.fight(userId1,userFighter1,userId2,userFighter2);

  res.redirect('fight/win', {outcome:outcome});
})

router.post('/user/buy', function(req, res){

})




module.exports = router;
