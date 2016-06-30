var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var game = require('../game/logic');

// in future, this should maybe pass u1 ( and uf1? )from the session
router.get('/:u1/:uf1', function(req, res){
  var user1 = req.params.u1;
  var userFighter1 = req.params.uf1;

  var getAllUsers = knex('users')
  var getUser1 = knex('users').where('id',user1).first()
  var getUserFighter1 = knex('fighters').where('id',userFighter1).first()

  Promise.all([getAllUsers,getUser1,getUserFighter1])
    .then(values => {
      res.render('fight/select', {
        users: values[0],
        user1: values[1],
        userFighter1: values[2]
        });
    })
})

router.post('/:u1/:uf1', function(req, res){
  var user1 = req.params.u1;
  var userFighter1 = req.params.uf1;

  var user2 = req.body.opponent;
  console.log('user2:',user2);
  new Promise((resolve,reject)=>{
    resolve(
      game.getOpponentFighter(user2)
    )
  }).then((userFighter2)=>{

    var getUser1 = knex('users').where('id',user1).first()
    var getUser2 = knex('users').where('id',user2).first()
    var getUserFighter1 = knex('fighters').where('id',userFighter1).first()
    var getUserFighter2 = knex('fighters').where('id',userFighter2).first()

    Promise.all([getUser1,getUser2,getUserFighter1,getUserFighter2])
    .then(values => {
      console.log('in the promise.all');
      console.log('values',values);
      res.render('fight/ready', {
        user1: values[0].id,
        user2: values[1].id,
        userFighter1: values[2].id,
        userFighter2: values[3].id
      })
    }, reason => {
      console.log(reason);
    })
  })
})



router.post('/:user1/:user1_fighter/:user2/:user2_fighter', function(req, res){
  var userId1 = req.params.user1;
  var userId2 = req.params.user2;
  var userFighter1 = req.params.user1_fighter;
  var userFighter2 = req.params.user2_fighter;

  var outcome = game.fight(userId1,userFighter1,userId2,userFighter2);

  res.render('fight/win', {outcome:outcome});
})

router.post('/:id/buy', function(req, res){
  var userId = req.params.id;
  var purchase = game.buyFighter(userId);
  if(purchase){
    res.redirect('/users/profile');
  }
})




module.exports = router;
