var knex = require('../db/knex');

// Player always receives random fighter

// fighter always has at least one random weapon

// player may buy new fighter in exchange for money

var game = {

  // returns ID of randomly chosen fighter
  getFighter: function(user_id){
    // get fighters count
    var num;
    knex('fighters')
      .count()
      .first()
      .then(result => {
        num = parseInt(result.count)

        var randomID = Math.ceil(Math.random() * num);

        // insert into users_fighters
        console.log('Adding user:',user_id,'fighter:',randomID);
        knex('users_fighters').insert({
          user_id: user_id,
          fighter_id: randomID
        }).then(result2 => {
          console.log(result2);

          // return fighter ID to assign weapon
          return randomID;
        })
      })
  },


  // randomly assigns a weapon from the pool to a fighter
  assignWeapon: function(fighter_id){
    // adds random weapon to fighter
    // NOTE only works if IDs in weapons table have no breaks, goes from 1 to Length
    var num;
    knex('weapons')
      .count()
      .first()
      .then(result => {
        num = parseInt(result.count)

        var randomID = Math.ceil(Math.random() * num);

        console.log('Assigning weapon to:',fighter_id,'weapon:',randomID);
        knex('fighters').where({'id':fighter_id}).update({
          weapon_id: randomID
        }).then(result2 => {
          console.log(result2);
        })
      })
  },


  // buys the user a fighter. returns success as true/false
  buyFighter: function(user_id){
    // check balance
    knex('users')
      .select('money')
      .where({id:user_id})
      .first()
      .then(result => {
        var cash = result.money
        console.log('user has '+ result.money + ' money');
        if (cash < 100){
          console.log('not enough money');
          return false
        }
        else {
          // else debit gold
          cash -= 100;
          knex('users')
            .where({id:user_id})
            .update({money:cash})
            .then(result2 => {
              console.log('buying a new fighter');
              // and add new fighter i.e. this.getFighter()
              // does so in a promise so that we can assign weapon after assigning fighter
              var newfighter = new Promise((resolve,reject) => {
                resolve(this.getFighter(user_id));
              }).then(fighter => {
                this.assignWeapon(fighter);
              })
              // return true
              return true;
            })
        }
      })
  },


  // returns ID of randomly chosen opponent fighter
  getOpponentFighter: function(opponent_id){
    knex('users_fighters')
      .where({user_id:opponent_id})
      .then( result => {
        var numFighters = result.length;
        var randomFighter = Math.floor(Math.random() * numFighters);
        return result[randomFighter].fighter_id
      })
  },


  //   fight/:user1/:user1_fighter/:user2/:user2_fighter
  //   returns {win: bool[, newWeapon: bool]}
  fight: function(user1,user1_fighter,user2,user2_fighter){
    // create a strength value for each fighter
    var f1 = knex('fighters')
    .join('weapons','fighters.weapon_id','=','weapons.id')
    .where({'fighters.id':user1_fighter})
    .first()

    var f2 = knex('fighters')
    .join('weapons','fighters.weapon_id','=','weapons.id')
    .where({'fighters.id':user2_fighter})
    .first()

    function str(obj){
      return obj.wins + obj.strength
    }

    function getWinner(f1str,f2str){
      var total = f1str + f2str;
      var outcome = Math.floor(Math.random() * total);

      if (outcome > f1str){
        // attacker loss
        return {
          winner: user2,
          loser: user1,
          dead: user1_fighter,
          alive: user2_fighter
        };
      }
      else {
        // attacker win
        return {
          winner: user1,
          loser: user2
          dead: user2_fighter,
          alive: user1_fighter
        };
      }
    }

    Promise.all([f1,f2]).then(values => {
      var f1str = str(values[0])
      var f2str = str(values[1])

      var fight = getWinner(f1str,f2str);

      // ----- FIGHT RESULTS ----- //

      // winner gains 25 gold
      var gain25 = new Promise(function(resolve, reject) {
        resolve(
          knex('users')
          .where({id:fight.winner})
          .increment('money',25)
          .then(result => {
            console.log(result)
          })
        )
      });

      // loser gains 5 gold
      var gain5 = new Promise((resolve,reject)=>{
        resolve(
          knex('users')
          .where({id:fight.loser})
          .increment('money',5)
          .then(result => {
            console.log(result);
          })
        )
      })

      // fighter +1 win
      var incrementWins = new Promise((resolve, reject) =>{
        resolve(
          knex('fighters')
          .where({id:fighter.alive})
          .increment('wins',1)
        )
      });

      // reset loser wins to zero
      var resetWins = new Promise((resolve, reject)=>{
        resolve(
          knex('fighters')
          .where({id:fighter.dead})
          .update({
            wins:0
          })
        )
      });

      // maybe fighter gets opponent fighter's weapon...
      var weaponXfer = new Promise((resolve,reject)=>{
        var coinflip = Math.random();
        if (coinflip > .5){
          knex('fighters')
          .column('weapon_id')
          .where({'id':fight.dead})
          .first()
          .then(result=>{
            // get dead fighter's weapon
            var weapon = result.weapon;
            // give dead fighter a new weapon
            this.assignWeapon(fight.dead)
            // give weapon to victor (lol maybe)
            knex('fighters')
            .where({'id':fight.alive})
            .update({
              weapon_id: weapon
            })
            .then(result2 => {
              console.log(result2);
              resolve(return true)
            })
          })
        }
        else {
          resolve(return false)
        }

      })

      // losing fighter dies AKA remove users_fighters row
      var killLoser = new Promise((resolve,reject)=>{
        resolve(
          knex('users_fighters')
          .where({ 'user_id':fighter.loser,
          'fighter_id': fighter.dead })
          .delete()
          .then(result=>{
            console.log(result);
          })
        )
      })

      // assign new fighter
      var newFighter = new Promise((resolve,reject)=>{
        resolve(
          this.getFighter(fighter.loser);
        )
      })

      // return RESULT object
      Promise.all([gain25,gain5,incrementWins,resetWins,weaponXfer,killLoser,newFighter])
        .then(values => {
          var xfer = values[4];
          if (user1 === fight.winner){
            return {
              win:true,
              newWeapon:xfer
            }
          }
          else {
            return {
              win:false
            }
          }
        })

    }) // end Promise.all

  },

} // end game

module.exports = game;
