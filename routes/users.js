var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var Users = knex('users');

function loggedInUser(req, res, next){
  if(req.session.userId){
    next();
  }else{
    res.redirect('users/signin');
  }
}

router.get('/', function(req, res){
  Users.then(function(result, err){
    res.render('/users/home', {users: result});
  });
});

router.get('/new', function(req, res){
  res.render('users/new');
});

router.get('/:id/edit', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', userid).first().then(function(result, err){
    var user = result;
    res.render('users/edit', {user: user});
  });
});

router.post('/', function(req, res){
  var user = req.body;
  Users.insert({
    full_name: user.full_name,
    username: user.username,
    avatar_url: user.avatar_url,
    wins: 0,
    losses: 0,
    money: 20
  }).then(function(result, err){
    res.redirect('/users')
  })
})

router.put('/:id', function(req, res){
  var userId = req.params.id;
  var user = req.body;
  if(user.password.length >= 8){
    var hash = bcrypt.hashSync(user.password, 10);
    Users.where('id', userId).update({
      full_name: user.full_name,
      username: user.username,
      avatar_url: user.avatar_url,
      password: hash
    }).then(function(result, err){
      res.redirect('/profile')
    });
  }else {
    res.redirect('/users')
  };
});

router.get('/:id', /*loggedInUser,*/ function(req, res){
  var userId = req.params.id;
  // var authId = req.sessions.userId;
  Users.where('id', userId).first().then(function(result, err){
    var user = result;
    console.log('retrieved user:',user);
    // if(userId === authId || adminUser){
    //   res.render('users/profile', {user: user});
    // }else{
    //   res.redirect('users/signin');
    // };
    knex('users_fighters')
      .join('fighters','users_fighters.fighter_id','=','fighters.id')
      .where('users_fighters.user_id',16)
      .innerJoin('fighters_weapons','fighters.id','=','fighters_weapons.fighter_id')
      .innerJoin('weapons','weapons.id','=','fighters_weapons.weapon_id')
      .then(fighters => {
        console.log(fighters)
        res.render('users/profile', {user:user,fighters:fighters})
      })

  });
  // TODO make an Admin function
  // Users.where('id', authId).first().then(function(adminUser, err){
  //   var adminUser = adminUser.admin;
  // })
});

router.delete('/:id', loggedInUser, function(req, res){
  var userId = req.params.id;
  var authId = req.sessions.userId;
  Users.where('id', userId).first().then(function(result, err){
    var user = results;
    if(userId === authId || user.admin){
      Users.where('id', userId).first().del().then(function(result, err){
        req.session=null;
        res.render('users/new');
      });
    }else{
      res.send('You are not authorized');
    };
  });
});

module.exports = router;
