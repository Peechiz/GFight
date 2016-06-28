var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
Weapon = knex('weapons');


router.get('/', function(req, res){
  Weapon.then(function(result, err){
    var weapon = result;
    res.render('weapons/index', {weapon: weapon});
  });
});

router.post('new', function(req, res){
  var weapon = req.body;
  Weapon.insert({
    weapon: weapon.weapon,
    strength: weapon.strength
  }).then(function(result, err){
    res.redirect('/weapons/index');
  })
})

router.get('new', function(req, res){
  res.render('weapons/new');
});

router.put(':id', function(req, res){
  var weapon = req.body;
  var weaponId = req.params.id;
  Weapon.where('id', weaponId).update({
    weapon: weapon.weapon,
    strength: weapon.strength
  }).then(function(result, err){
    res.redirect('/weapons/idex')
  })
})

router.get(':id/edit', function(req,res){
  weaponId = req.params.id;
  Weapon.where('id', weaponId).then(function(result, err){
    var weapon = result;
    res.render('weapon/edit', {weapon: weapon});
  });
});

module.exports = router;
